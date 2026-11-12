# AegisPass — Enterprise Visitor Management System (VMS)

A full-fledged, production-grade frontend for an Enterprise Physical Identity and Access Management (PIAM) system. Designed for corporate headquarters, data centers, and multi-facility enterprises with high security compliance (SOC 2 Type II, ISO 27001, OSHA).

---

## Key Highlights & Design Principles

- **Zero Floating / Zero Pill / Zero Gradient System**: Crisp, docked, high-contrast B2B aesthetic engineered for operations centers.
- **100% Client-Side Stateful Execution**: Complete interactive CRUD, physical badge generation, emergency roll calls, and legal NDA signatures running entirely on local mock data and persistent LocalStorage.
- **Physical Thermal Badge Dispatch**: Formatted for standard Zebra and Brother thermal badge printers with SVG 2D QR matrix and customizable access permissions.
- **Touchscreen Self-Service Kiosk**: Front-desk iPad simulator with HTML5 canvas digital signature pad for instant walk-in registrations and pre-cleared pass scans.

---

## Modules

1. **Operations Command Center**
   - Live Headcount Telemetry (On-site, Expected, Overstay alerts, Pending packages)
   - 24-Hour Facility Hourly Occupancy Chart
   - Clearance Demographics Breakdown
   - Real-time turnstile audit stream

2. **Visitor Registry & Movement Log**
   - Multi-field search and status filters (On-Site, Expected, Departed, Overstay, Access Denied)
   - Fast walk-in check-in modal
   - Printable physical security badge modal
   - CSV manifest export

3. **Visitor Dossier**
   - Comprehensive visitor bio, host details, timestamps, government ID status, legal NDA execution status, and security notes.

4. **Pre-Registration & Digital Invites**
   - Schedule future visits with automated encrypted QR pass codes.
   - Bulk CSV delegation manifest importer.

5. **Self-Check-In Kiosk Mode (iPad Simulator)**
   - 4-step wizard: Pass code lookup / Walk-in intake -> Interactive HTML5 canvas NDA signature -> Instant host Slack/SMS alert -> Physical pass print.

6. **Security Watchlist & Denied Persons**
   - Real-time turnstile intercept simulator for terminated employees and court injunctions.
   - Live name match testing engine.

7. **Emergency Muster & Evacuation System**
   - Real-time roll call for Fire Marshals with live Accounted vs Missing counters.
   - One-click safe verification and Fire Department manifest print layout.

8. **Courier & Delivery Log**
   - Track packages across FedEx, DHL, UPS, Amazon Logistics, and BlueDart.
   - Locker and shelf allocation with recipient collection notifications.

9. **Host Staff Directory**
   - Internal employee directory with desk locations, availability toggles, and active visitor loads.

10. **Compliance & Audit Log**
    - Tamper-evident SOC 2 audit log with precision timestamps and CSV export.

---

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS (Custom flat enterprise theme)
- **Icons**: Lucide React
- **Storage**: Browser LocalStorage with fallback mock datasets

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
```
Outputs static bundle to `dist/`.
