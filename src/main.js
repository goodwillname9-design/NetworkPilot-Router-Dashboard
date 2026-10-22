import './style.css';

const icons = {
  grid: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  devices: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="13" height="10" rx="2"/><path d="M7 20h5M9.5 14v6"/><rect x="17" y="8" width="4" height="11" rx="1.3"/></svg>',
  activity: '<svg viewBox="0 0 24 24"><path d="M3 12h4l3-8 4 16 3-8h4"/></svg>',
  shield: '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></svg>',
  settings: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.6-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.6 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z" transform="translate(-1 -1) scale(1.08)"/></svg>',
  wifi: '<svg viewBox="0 0 24 24"><path d="M2 8.5a15 15 0 0 1 20 0M5 12a10.5 10.5 0 0 1 14 0M8.5 15.5a5.5 5.5 0 0 1 7 0"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/></svg>',
  router: '<svg viewBox="0 0 24 24"><rect x="3" y="10" width="18" height="10" rx="2"/><path d="M7 10V6m10 4V6M8 15h.01M12 15h.01M16 15h.01"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>',
  bell: '<svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>',
  arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
  download: '<svg viewBox="0 0 24 24"><path d="M12 3v12m-5-5 5 5 5-5M4 20h16"/></svg>',
  laptop: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="13" rx="1.5"/><path d="M2 20h20"/></svg>',
  phone: '<svg viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>',
  tv: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="13" rx="2"/><path d="m9 22 3-4 3 4"/></svg>',
  more: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>'
};
const icon = (name) => `<span class="icon">${icons[name] || icons.grid}</span>`;

const demoDevices = [
  { name: 'MacBook Pro', type: 'laptop', ip: '192.168.1.12', mac: 'A4:5E:60:9B:21:8C', band: '5 GHz', status: 'Online', usage: '8.4 GB', vendor: 'Apple' },
  { name: 'iPhone 15', type: 'phone', ip: '192.168.1.14', mac: 'D8:3A:DD:42:71:09', band: '5 GHz', status: 'Online', usage: '3.1 GB', vendor: 'Apple' },
  { name: 'Living Room TV', type: 'tv', ip: '192.168.1.18', mac: '8C:85:90:AA:30:11', band: '2.4 GHz', status: 'Online', usage: '12.8 GB', vendor: 'Unknown' },
  { name: 'Windows PC', type: 'laptop', ip: '192.168.1.21', mac: '50:EB:F6:11:2C:77', band: '5 GHz', status: 'Online', usage: '21.6 GB', vendor: 'Microsoft' },
  { name: 'Tablet', type: 'phone', ip: '192.168.1.25', mac: '70:3E:AC:6D:91:42', band: '2.4 GHz', status: 'Offline', usage: '0.8 GB', vendor: 'Unknown' },
  { name: 'Smart Speaker', type: 'tv', ip: '192.168.1.31', mac: '2C:AA:8E:4C:17:52', band: '2.4 GHz', status: 'Online', usage: '1.2 GB', vendor: 'Unknown' }
];

let devices = demoDevices.map(d => ({...d}));
let currentPage = 'Overview';
let searchTerm = '';
let isDemo = true;
let routerName = 'Router not connected';
let liveNetwork = { ipv4: '192.168.8.81', gateway: '192.168.8.1', subnet: '255.255.255.0', interface: 'Ethernet' };
let liveScanMessage = '';
let scanning = false;
let toastTimer;
const app = document.querySelector('#app');

function toast(message) {
  const node = document.querySelector('#toast');
  if (!node) return;
  node.textContent = message;
  node.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove('show'), 2800);
}
function navItem(name, ico) {
  return `<button class="nav-item ${currentPage === name ? 'active' : ''}" data-page="${name}">${icon(ico)}<span>${name}</span>${name === 'Devices' ? '<span class="nav-count">'+devices.length+'</span>' : ''}</button>`;
}
function shell(content) {
  app.innerHTML = `
    <aside class="sidebar">
      <div class="brand"><div class="brand-mark">${icon('wifi')}</div><div><strong>NetworkPilot</strong><small>HOME NETWORK</small></div></div>
      <div class="workspace"><div class="workspace-icon">${icon('router')}</div><div><b>My network</b><small>${isDemo ? 'Demo environment' : 'Local network'}</small></div><span class="chevron">⌄</span></div>
      <div class="nav-label">WORKSPACE</div>
      <nav>${navItem('Overview','grid')}${navItem('Devices','devices')}${navItem('Traffic','activity')}${navItem('Security','shield')}</nav>
      <div class="nav-label tools-label">PREFERENCES</div>
      <nav>${navItem('Settings','settings')}</nav>
      <div class="sidebar-bottom"><div class="help-card"><div class="help-icon">${icon('shield')}</div><b>Stay in control</b><p>Know what is connected to your network.</p><button data-page="Security">View security tips ${icon('arrow')}</button></div><div class="user-row"><div class="avatar">NP</div><div><b>Network owner</b><small>Local dashboard</small></div><button class="more-btn" title="More options">${icon('more')}</button></div></div>
    </aside>
    <main class="main">
      <header class="topbar"><button class="mobile-menu" id="mobile-menu">☰</button><div class="breadcrumbs">Workspace <span>/</span> <b>${currentPage}</b></div><div class="top-actions"><div class="demo-pill"><span></span>${isDemo ? 'Demo data' : 'Connected'}</div><button class="icon-button" id="help-btn" aria-label="Help">${icon('bell')}</button><div class="avatar">NP</div></div></header>
      <div class="page-wrap">${content}</div>
      <footer>NetworkPilot <span>•</span> Independent network dashboard <span class="footer-right">Demo values are illustrative until a supported router integration is configured.</span></footer>
    </main>
    <div id="toast" class="toast" role="status"></div>`;
  app.querySelectorAll('[data-page]').forEach(btn => btn.addEventListener('click', () => { currentPage = btn.dataset.page; render(); }));
  document.querySelector('#help-btn')?.addEventListener('click', () => toast('This dashboard is a starter project. Check Settings for setup guidance.'));
  document.querySelector('#mobile-menu')?.addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));
}
function pageHeader(title, subtitle, action='') {
  return `<div class="page-heading"><div><div class="eyebrow">NETWORK OVERVIEW</div><h1>${title}</h1><p>${subtitle}</p></div>${action}</div>`;
}
function overview() {
  const online = devices.filter(d => d.status === 'Online').length;
  return `${pageHeader('Your network, at a glance','Monitor devices and understand your home network from one place.',`<button class="btn btn-primary" id="scan-btn">${icon('search')} ${scanning ? 'Scanning…' : 'Scan network'}</button>`)}
    <div class="notice ${isDemo ? '' : 'notice-success'}"><span class="notice-symbol">i</span><div><b>${liveScanMessage ? 'Local scan result' : (isDemo ? 'You’re viewing sample data' : 'Local network integration selected')}</b><p>${escapeHtml(liveScanMessage || (isDemo ? 'These devices and traffic figures are examples only — they are not detected on your Wi-Fi.' : 'Scan using the local NetworkPilot agent to discover devices visible on this LAN. Router controls require supported hardware.'))}</p></div><button class="notice-link" data-page="Settings">Setup guide ${icon('arrow')}</button></div>
    <section class="stats-grid">
      <article class="stat-card"><div class="stat-top"><span>Connected devices</span><span class="stat-icon purple">${icon('devices')}</span></div><div class="stat-value">${online}<small> / ${devices.length}</small></div><div class="stat-foot"><span class="dot green"></span> Sample online devices</div></article>
      <article class="stat-card"><div class="stat-top"><span>Download speed</span><span class="stat-icon blue">${icon('activity')}</span></div><div class="stat-value">${isDemo ? '84.6' : '—'}<small> Mbps</small></div><div class="stat-foot"><span class="trend">↗</span> ${isDemo ? 'Illustrative measurement' : 'Not measured'}</div></article>
      <article class="stat-card"><div class="stat-top"><span>Upload speed</span><span class="stat-icon cyan">${icon('arrow')}</span></div><div class="stat-value">${isDemo ? '22.3' : '—'}<small> Mbps</small></div><div class="stat-foot"><span class="trend">↗</span> ${isDemo ? 'Illustrative measurement' : 'Not measured'}</div></article>
      <article class="stat-card"><div class="stat-top"><span>Network status</span><span class="stat-icon green">${icon('shield')}</span></div><div class="stat-value status-value"><span class="status-dot"></span>${isDemo ? 'Healthy' : 'Unknown'}</div><div class="stat-foot">${isDemo ? 'Demo status only' : 'Router not verified'}</div></article>
    </section>
    <section class="content-grid"><article class="panel traffic-panel"><div class="panel-head"><div><h2>Network activity</h2><p>Illustrative traffic over the last 24 hours</p></div><select id="traffic-period" aria-label="Traffic period"><option>Last 24 hours</option><option>Last 7 days</option></select></div><div class="chart-legend"><span><i class="legend-download"></i> Download</span><span><i class="legend-upload"></i> Upload</span></div><div class="chart"><div class="chart-y"><span>100</span><span>75</span><span>50</span><span>25</span><span>0 Mbps</span></div><div class="chart-area"><div class="chart-grid-lines"><i></i><i></i><i></i><i></i><i></i></div><svg viewBox="0 0 700 220" preserveAspectRatio="none" aria-label="Illustrative network traffic chart"><defs><linearGradient id="areaA" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7167f8" stop-opacity=".25"/><stop offset="100%" stop-color="#7167f8" stop-opacity="0"/></linearGradient></defs><path d="M0 150 C40 140 45 110 80 125 S120 80 150 108 S195 155 225 110 S270 70 300 98 S340 135 370 92 S415 80 450 105 S490 40 520 70 S560 120 590 75 S640 95 700 32 L700 220 L0 220Z" fill="url(#areaA)"/><path d="M0 150 C40 140 45 110 80 125 S120 80 150 108 S195 155 225 110 S270 70 300 98 S340 135 370 92 S415 80 450 105 S490 40 520 70 S560 120 590 75 S640 95 700 32" fill="none" stroke="#7167f8" stroke-width="3" vector-effect="non-scaling-stroke"/><path d="M0 190 C50 180 60 170 95 182 S150 165 180 178 S230 190 270 168 S330 185 370 160 S420 177 460 165 S500 182 540 150 S600 174 640 145 S670 160 700 130" fill="none" stroke="#36c5d8" stroke-width="2.5" vector-effect="non-scaling-stroke"/></svg><div class="chart-x"><span>12 AM</span><span>4 AM</span><span>8 AM</span><span>12 PM</span><span>4 PM</span><span>8 PM</span><span>Now</span></div></div></div></article>
    <article class="panel router-panel"><div class="panel-head"><div><h2>Router status</h2><p>Connection details</p></div><span class="pill pill-muted">${isDemo ? 'Not linked' : 'Pending'}</span></div><div class="router-illustration"><div class="router-waves"><i></i><i></i><i></i></div><div class="router-device">${icon('router')}<div class="router-leds"><i></i><i></i><i></i><i></i></div></div></div><div class="router-info"><div><span>Router</span><b>${escapeHtml(routerName)}</b></div><div><span>Gateway IP</span><b>${escapeHtml(liveNetwork.gateway)}</b></div><div><span>PC / Interface</span><b>${escapeHtml(liveNetwork.ipv4)} · ${escapeHtml(liveNetwork.interface)}</b></div></div><button class="btn btn-outline btn-full" data-page="Settings">Configure router ${icon('arrow')}</button></article></section>
    <section class="panel devices-panel"><div class="panel-head"><div><h2>Devices on your network</h2><p>Recent device list · sample data</p></div><button class="text-btn" data-page="Devices">View all devices ${icon('arrow')}</button></div>${deviceTable(devices.slice(0,4), false)}</section>`;
}
function deviceTable(list, full=true) {
  return `<div class="table-tools"><label class="searchbox">${icon('search')}<input id="device-search" placeholder="Search devices..." value="${escapeHtml(searchTerm)}" /></label>${full ? `<select id="status-filter"><option value="all">All statuses</option><option>Online</option><option>Offline</option></select><button class="btn btn-outline btn-sm" id="export-btn">${icon('download')} Export CSV</button>` : ''}</div>
  <div class="table-scroll"><table><thead><tr><th>DEVICE</th><th>IP ADDRESS</th><th>CONNECTION</th><th>DATA USAGE</th><th>STATUS</th><th></th></tr></thead><tbody>${list.map(d => `<tr><td><div class="device-cell"><span class="device-icon">${icon(d.type)}</span><div><b>${escapeHtml(d.name)}</b><small>${escapeHtml(d.vendor)} · ${escapeHtml(d.mac)}</small></div></div></td><td class="mono">${d.ip}</td><td><span class="connection"><span class="wifi-mini">${icon('wifi')}</span>${d.band}</span></td><td>${d.usage}</td><td><span class="device-status ${d.status.toLowerCase()}"><i></i>${d.status}</span></td><td><button class="more-btn device-more" data-device="${escapeHtml(d.mac)}" aria-label="Device options">${icon('more')}</button></td></tr>`).join('') || `<tr><td colspan="6" class="empty">No devices match your search.</td></tr>`}</tbody></table></div>`;
}
function devicesPage() {
 return `${pageHeader('Connected devices','Review device details and export the sample inventory.',`<button class="btn btn-outline" id="export-btn">${icon('download')} Export CSV</button>`)}
 <div class="notice"><span class="notice-symbol">i</span><div><b>Local network inventory</b><p>Run the local agent and scan to list devices visible in Windows ARP cache. Speed limits and disconnect/block controls require a compatible router integration.</p></div></div>
 <section class="panel devices-panel">${deviceTable(filterDevices(), true)}</section>`;
}
function filterDevices() {
 const term = searchTerm.toLowerCase();
 return devices.filter(d => `${d.name} ${d.ip} ${d.mac} ${d.vendor}`.toLowerCase().includes(term));
}
function trafficPage() {
 return `${pageHeader('Traffic analytics','Understand usage patterns. The figures below are illustrative in demo mode.')}
 <div class="notice"><span class="notice-symbol">i</span><div><b>Traffic is not being measured</b><p>Public websites cannot see your router traffic by themselves. A supported router API or local agent is required for real measurements.</p></div></div>
 <section class="stats-grid"><article class="stat-card"><div class="stat-top"><span>Download used</span><span class="stat-icon purple">${icon('download')}</span></div><div class="stat-value">${isDemo ? '46.8' : '—'}<small> GB</small></div><div class="stat-foot">Last 24 hours · ${isDemo ? 'sample' : 'no data'}</div></article><article class="stat-card"><div class="stat-top"><span>Upload used</span><span class="stat-icon cyan">${icon('arrow')}</span></div><div class="stat-value">${isDemo ? '8.2' : '—'}<small> GB</small></div><div class="stat-foot">Last 24 hours · ${isDemo ? 'sample' : 'no data'}</div></article><article class="stat-card"><div class="stat-top"><span>Peak download</span><span class="stat-icon blue">${icon('activity')}</span></div><div class="stat-value">${isDemo ? '92.1' : '—'}<small> Mbps</small></div><div class="stat-foot">Illustrative peak</div></article><article class="stat-card"><div class="stat-top"><span>Active time</span><span class="stat-icon green">${icon('wifi')}</span></div><div class="stat-value">${isDemo ? '18.4' : '—'}<small> hrs</small></div><div class="stat-foot">Sample connection time</div></article></section>
 <section class="panel traffic-panel"><div class="panel-head"><div><h2>Usage by device</h2><p>Illustrative daily usage</p></div></div>${devices.map(d=>`<div class="usage-row"><div class="usage-name">${icon(d.type)}<span>${escapeHtml(d.name)}</span></div><div class="usage-bar"><i style="width:${parseFloat(d.usage)*3}%"></i></div><b>${d.usage}</b></div>`).join('')}</section>`;
}
function securityPage() {
 return `${pageHeader('Security centre','Practical checks to help keep your home network safer.')}
 <div class="notice notice-success"><span class="notice-symbol">✓</span><div><b>Security checklist</b><p>These are recommendations only; no router security scan has been performed.</p></div></div>
 <section class="security-grid"><article class="panel security-card"><span class="security-big purple">${icon('shield')}</span><h2>Secure your router</h2><p>Use a unique administrator password and update the router firmware from its official vendor interface.</p><span class="pill pill-muted">Action recommended</span></article><article class="panel security-card"><span class="security-big blue">${icon('wifi')}</span><h2>Protect Wi-Fi access</h2><p>Prefer WPA2-AES or WPA3 where supported. Disable WPS if you do not need it.</p><span class="pill pill-muted">Check router settings</span></article><article class="panel security-card"><span class="security-big green">${icon('devices')}</span><h2>Review unknown devices</h2><p>Compare your router’s actual connected-device list with devices you own before taking action.</p><span class="pill pill-muted">Manual review</span></article><article class="panel security-card"><span class="security-big cyan">${icon('router')}</span><h2>Remote administration</h2><p>Avoid exposing the router admin page directly to the public internet. Prefer a trusted VPN for remote access.</p><span class="pill pill-warning">Important</span></article></section>
 <section class="panel"><div class="panel-head"><div><h2>Quick security checklist</h2><p>Mark items as you verify them on your router.</p></div></div><div class="checklist">${[['admin','Changed default admin password'],['firmware','Checked for official firmware updates'],['wifi','Using WPA2-AES or WPA3'],['wps','Disabled WPS if not needed'],['remote','Remote admin access is disabled or protected by VPN']].map(([id,label])=>`<label class="check-item"><input type="checkbox" data-check="${id}"><span>${label}</span></label>`).join('')}</div></section>`;
}
function settingsPage() {
 return `${pageHeader('Settings','Connect the dashboard to a supported local network integration.')}
 <section class="panel settings-panel"><div class="settings-title"><span class="settings-icon">${icon('router')}</span><div><h2>Router connection</h2><p>Choose the integration method that matches your hardware.</p></div></div>
 <div class="form-grid"><label>Router brand or model<input id="router-model" placeholder="e.g. TP-Link Archer C6, Huawei HG..." value="${escapeHtml(routerName === 'Router not connected' ? '' : routerName)}"></label><label>Gateway IP<input id="gateway-ip" value="${escapeHtml(liveNetwork.gateway)}" placeholder="e.g. 192.168.8.1"></label></div><div class="settings-note"><b>Detected PC network</b><p>IPv4: ${escapeHtml(liveNetwork.ipv4)} · Subnet: ${escapeHtml(liveNetwork.subnet)} · Adapter: ${escapeHtml(liveNetwork.interface)}</p></div>
 <div class="settings-note"><b>What works in this starter version?</b><p>The dashboard layout, navigation, searchable sample device list, CSV export, security checklist, and responsive UI work now. Real device discovery, blocking, bandwidth limits, router settings, and live traffic need a trusted local agent or router API that supports your exact model.</p></div>
 <div class="settings-actions"><button class="btn btn-primary" id="save-router">Save display settings</button><button class="btn btn-outline" id="demo-toggle">${isDemo ? 'Hide sample values' : 'Show sample values'}</button></div></section>
 <section class="panel setup-steps"><div class="panel-head"><div><h2>Integration roadmap</h2><p>Recommended order for a free-first implementation</p></div></div><ol><li><b>Identify your router</b><p>Check the label underneath the router or its admin page for the exact model and firmware.</p></li><li><b>Check official support</b><p>Look for an official API, documented local management interface, or a compatible open-source local agent. Do not send router passwords to a third-party website.</p></li><li><b>Run the connector locally</b><p>A local agent on a PC or small home server can query the router on your LAN. Keep its API bound to localhost or protected by authentication.</p></li><li><b>Remote access securely</b><p>Use a reputable VPN such as WireGuard or Tailscale (check current free-plan limits) rather than exposing router admin or a local agent directly to the internet.</p></li></ol></section>`;
}
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function render() {
 let content = currentPage === 'Overview' ? overview() : currentPage === 'Devices' ? devicesPage() : currentPage === 'Traffic' ? trafficPage() : currentPage === 'Security' ? securityPage() : settingsPage();
 shell(content);
 document.querySelectorAll('[data-page]').forEach(btn => btn.addEventListener('click', () => { currentPage = btn.dataset.page; render(); }));
 document.querySelector('#scan-btn')?.addEventListener('click', scanLocalNetwork);
 document.querySelector('#device-search')?.addEventListener('input', e => { searchTerm = e.target.value; const pos = e.target.selectionStart; render(); const input = document.querySelector('#device-search'); input?.focus(); input?.setSelectionRange(pos,pos); });
 document.querySelector('#export-btn')?.addEventListener('click', exportCSV);
 document.querySelector('#save-router')?.addEventListener('click', () => { routerName = document.querySelector('#router-model').value.trim() || 'Router not connected'; const gw = document.querySelector('#gateway-ip').value.trim(); if (gw) liveNetwork.gateway = gw; toast('Settings saved for this session.'); render(); });
 document.querySelector('#demo-toggle')?.addEventListener('click', () => { isDemo = !isDemo; if (!isDemo) devices = devices.map(d => ({...d, status:'Offline'})); else devices = demoDevices.map(d => ({...d})); render(); });
 document.querySelectorAll('.device-more').forEach(btn => btn.addEventListener('click', () => {
   const d = devices.find(x => x.mac === btn.dataset.device);
   if (!d) return;
   const choice = prompt(`Device: ${d.name} (${d.ip})\nChoose: speed | block | rename\n\nSpeed/block require an authenticated integration supported by your exact router. This starter will not pretend to change the real network.`);
   if (choice?.toLowerCase() === 'rename') { const name = prompt('New display name:', d.name); if (name?.trim()) d.name = name.trim(); render(); }
   else if (choice?.toLowerCase() === 'speed') { const limit = prompt('Desired limit in Mbps (download/upload) for your notes only:', '10/2'); if (limit) toast('Saved nowhere: actual speed enforcement needs compatible router QoS/API.'); }
   else if (choice?.toLowerCase() === 'block') { toast('Real block/disconnect is not enabled until the router integration is configured.'); }
 }));
 document.querySelector('#status-filter')?.addEventListener('change', e => {
   const term = searchTerm.toLowerCase();
   const list = devices.filter(d => `${d.name} ${d.ip} ${d.mac} ${d.vendor}`.toLowerCase().includes(term) && (e.target.value === 'all' || d.status === e.target.value));
   const tbody = document.querySelector('tbody');
   if (tbody) tbody.innerHTML = list.map(d => `<tr><td><div class="device-cell"><span class="device-icon">${icon(d.type)}</span><div><b>${escapeHtml(d.name)}</b><small>${escapeHtml(d.vendor)} · ${escapeHtml(d.mac)}</small></div></div></td><td class="mono">${d.ip}</td><td>${d.band}</td><td>${d.usage}</td><td><span class="device-status ${d.status.toLowerCase()}"><i></i>${d.status}</span></td><td></td></tr>`).join('') || '<tr><td colspan="6" class="empty">No devices match your filter.</td></tr>';
 });
}

async function scanLocalNetwork() {
  if (scanning) return;
  scanning = true; isDemo = false; liveScanMessage = 'Scanning local network via NetworkPilot agent…'; render();
  try {
    const response = await fetch('http://127.0.0.1:4317/api/scan', { method: 'POST' });
    if (!response.ok) throw new Error('Agent returned HTTP ' + response.status);
    const data = await response.json();
    liveNetwork = { ...liveNetwork, ...(data.network || {}) };
    devices = Array.isArray(data.devices) ? data.devices : [];
    liveScanMessage = `${devices.length} device(s) visible in the local ARP table. This is a best-effort scan; sleeping or isolated devices may not appear.`;
    toast('Local scan completed.');
  } catch (error) {
    liveScanMessage = 'Local agent not running. In a second terminal run: npm run agent. This scan only discovers devices visible on your own local network.';
    toast('Start the NetworkPilot local agent first.');
  } finally { scanning = false; render(); }
}
function exportCSV() {
 const rows = [['Name','Type','IP Address','MAC Address','Band','Status','Usage','Vendor'], ...devices.map(d => [d.name,d.type,d.ip,d.mac,d.band,d.status,d.usage,d.vendor])];
 const csv = rows.map(row => row.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\r\n');
 const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
 const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='networkpilot-devices-demo.csv'; a.click(); URL.revokeObjectURL(url);
 toast('Sample device list exported as CSV.');
}
render();
