# NetworkPilot — local network dashboard

Free-first router dashboard prototype with an optional Windows local helper.

## What is included now
- Dashboard UI with device search and CSV export.
- Windows local helper bound to `127.0.0.1:4317` only.
- Best-effort local `/24` discovery by pinging hosts and reading the Windows ARP table.
- Detects the active private IPv4 adapter and default gateway where possible.
- Clear UI for speed/block requests, without pretending unsupported router actions succeeded.

## Run on Windows
1. Install Node.js LTS from https://nodejs.org/.
2. Extract this ZIP and open the folder in VS Code.
3. In terminal 1 run `npm install`, then `npm run agent`.
4. In terminal 2 run `npm run dev`.
5. Open the Vite local URL (normally `http://localhost:5173`) and click **Scan network**.

The helper listens only on loopback, not on the LAN or internet. It does not require router credentials. Windows Firewall or endpoint protection may affect ping/ARP discovery.

## Important limits
- ARP/ping discovery is best effort. Sleeping devices, guest Wi-Fi/client isolation, VLANs, firewalls and switches can hide devices. The displayed online status means visible/recently reachable, not guaranteed active.
- This helper does **not** change other devices' connection or speed. Blocking devices and setting per-device bandwidth/QoS are router-specific features; they require the exact router model/firmware and an authenticated, documented management interface. No generic command can safely enable this on every network.
- The helper does not scan networks outside the currently connected private IPv4 `/24`.
- Do not expose the local agent or router admin page to the public internet. For remote management use a properly secured VPN and authenticated router integration.
- Sample traffic values remain illustrative. Live bandwidth measurements are not implemented.

## Build
`npm run build`

## Before adding real router controls
Identify the router make/model and firmware. Then use only the vendor's documented local API or an established compatible integration. Keep credentials on the local helper, add authentication/CSRF protections, and test read-only access before enabling any blocking or QoS changes.
