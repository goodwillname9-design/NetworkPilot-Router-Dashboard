# NetworkPilot local network helper (Windows)

This free helper is an optional local-only companion to the dashboard. It reads Windows network interface information and the current ARP cache. It does **not** log in to your router, perform a guaranteed full scan, determine Wi-Fi-vs-Ethernet for every client, disconnect devices, change Wi-Fi settings, or enforce speed limits.

## Run it

1. Install Node.js LTS if it is not already installed.
2. Open PowerShell in this project folder.
3. Run `npm install` once.
4. In one terminal run `npm run agent`.
5. In a second terminal run `npm run dev`.
6. Open the Vite local URL printed by the terminal (normally `http://localhost:5173`) and press **Scan network**.

The helper binds only to `127.0.0.1:4179`, not to your LAN or public internet. Keep it that way. The scan displays only devices Windows already knows from its ARP cache; devices may be missing until your PC has communicated with them. Do not use network controls on networks you do not own or administer.

## Your current values from ipconfig

- PC IPv4: `192.168.8.81`
- Default gateway: `192.168.8.1`
- Subnet mask: `255.255.255.0`
- Link: Ethernet

## Real router controls

Wi-Fi/Ethernet client counts, block/unblock, per-device speed limits, and Wi-Fi radio on/off require an authenticated router API or vendor-specific integration. These capabilities are intentionally not simulated as successful actions. Never expose router credentials or the local helper directly to the internet.
