/**
 * NetworkPilot local helper (Windows-friendly, read-only discovery).
 * Binds only to loopback. Does not store router passwords or change router settings.
 */
import http from 'node:http';
import os from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const execFileAsync = promisify(execFile);
const HOST = '127.0.0.1';
const PORT = 4317;
const allowedOrigin = new Set(['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:4173', 'http://127.0.0.1:4173']);

function getNetwork() {
  const all = os.networkInterfaces();
  for (const [name, entries] of Object.entries(all)) {
    for (const item of entries || []) {
      if (item.family === 'IPv4' && !item.internal && /^192\.168\.|^10\.|^172\.(1[6-9]|2\d|3[01])\./.test(item.address)) {
        const parts = item.address.split('.').map(Number);
        return { ipv4: item.address, subnet: item.netmask, interface: name, prefix: parts.slice(0,3).join('.') };
      }
    }
  }
  return { ipv4: '', subnet: '', interface: '', prefix: '' };
}
async function readArp() {
  const net = getNetwork();
  if (!net.prefix) throw new Error('No private IPv4 interface found. Connect to the network you own/manage.');
  // Best effort: populate ARP by pinging the local /24 only, at low concurrency.
  const base = net.prefix;
  const queue = Array.from({length:254}, (_,i)=>i+1).filter(n => `${base}.${n}` !== net.ipv4);
  let cursor = 0;
  async function worker() {
    while (cursor < queue.length) {
      const n = queue[cursor++];
      try { await execFileAsync('ping.exe', ['-n','1','-w','180',`${base}.${n}`], { windowsHide:true, timeout:500 }); } catch {}
    }
  }
  await Promise.all(Array.from({length:24}, worker));
  let stdout = '';
  try { ({stdout} = await execFileAsync('arp.exe', ['-a'], {windowsHide:true, timeout:4000})); }
  catch (e) { stdout = String(e.stdout || ''); }
  const rows = [];
  const regex = /\s*(\d{1,3}(?:\.\d{1,3}){3})\s+([0-9a-f]{2}(?:-[0-9a-f]{2}){5})\s+(dynamic|static)/ig;
  for (const m of stdout.matchAll(regex)) {
    if (!m[1].startsWith(base + '.')) continue;
    if (m[1] === net.ipv4 || m[2].toLowerCase() === 'ff-ff-ff-ff-ff-ff') continue;
    rows.push({ name: 'LAN device', type: 'laptop', ip: m[1], mac: m[2].replaceAll('-', ':').toUpperCase(), band: 'LAN (unknown)', status: 'Online', usage: 'Not measured', vendor: 'Unknown' });
  }
  const unique = [...new Map(rows.map(d=>[d.mac,d])).values()];
  unique.unshift({name:'This PC',type:'laptop',ip:net.ipv4,mac:'LOCAL-DEVICE',band:'Ethernet/Wi-Fi',status:'Online',usage:'Not measured',vendor:'Windows PC'});
  return {network:{ipv4:net.ipv4,subnet:net.subnet,interface:net.interface,gateway:''},devices:unique};
}
const server = http.createServer(async (req,res)=>{
  const origin = req.headers.origin;
  if (origin && allowedOrigin.has(origin)) { res.setHeader('Access-Control-Allow-Origin', origin); res.setHeader('Vary','Origin'); }
  res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  if (req.method === 'GET' && req.url === '/api/health') { res.writeHead(200,{'Content-Type':'application/json'}); return res.end(JSON.stringify({ok:true,host:HOST,port:PORT})); }
  if (req.method === 'POST' && req.url === '/api/scan') {
    try {
      const data = await readArp();
      // Determine gateway from route table, not a hard-coded network address.
      try {
        const {stdout} = await execFileAsync('powershell.exe',['-NoProfile','-Command','(Get-NetRoute -DestinationPrefix "0.0.0.0/0" | Sort-Object RouteMetric | Select-Object -First 1 -ExpandProperty NextHop)'],{windowsHide:true,timeout:3000});
        if (stdout.trim()) data.network.gateway = stdout.trim();
      } catch {}
      res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}); return res.end(JSON.stringify(data));
    } catch (e) { res.writeHead(500,{'Content-Type':'application/json'}); return res.end(JSON.stringify({error:e.message || 'Scan failed'})); }
  }
  res.writeHead(404,{'Content-Type':'application/json'}); res.end(JSON.stringify({error:'Not found'}));
});
server.listen(PORT, HOST, ()=>console.log(`NetworkPilot local agent ready at http://${HOST}:${PORT} (loopback only)`));
