# SecureOps

**ZolexTech & Consultant — Enterprise Security Operations Platform**

A full-stack security operations dashboard built with React 18 + Vite. Features real-time threat monitoring, infrastructure management, compliance tracking, AI-powered analysis, and 25 fully functional views — all in a single deployable React application.

---

## Live Demo

> Deploy to Netlify or Vercel in under 2 minutes — see [Deployment](#deployment) below.

---

## Features

| Category | Views |
|---|---|
| **Security Ops** | CI/CD Pipeline · Infrastructure (Terraform/AWS) · Security Scanning · Vulnerability Mgmt · Cloud Posture · Pen Test |
| **Monitoring** | SIEM & Logs · Threat Hunt · Incidents · Network Map · Asset Inventory |
| **Governance** | Compliance (SOC2/ISO/NIST) · Risk Register · Audit & Logging |
| **Platform** | Grafana Plugin · AI Analyst · Live Events · Services · Reports · Team · Dev Portal |
| **Account** | Billing · Settings · My Account |

**Highlights:**
- 🔴 Real-time event stream (WebSocket-style live feed, 500-event buffer)
- ✦ AI Security Analyst powered by Claude Sonnet via Anthropic API
- ⚡ Live service metrics with animated CPU/memory gauges
- 🛡 Full Pen Test engagement manager with CVSS-scored findings
- ⬡ Terraform IaC view with plan/apply terminal, drift detection, cost analysis
- 🔑 Microsoft Sentinel integration with guided repair workflow
- ⌘K Command Palette + Global Search + 14 keyboard navigation shortcuts
- 🎨 Dark terminal aesthetic — JetBrains Mono + Rajdhani, cyan/amber/red palette

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install & run

```bash
git clone https://github.com/lexxy2422/secureops.git
cd secureops

npm install

# Copy and fill in environment variables
cp .env.example .env
# Edit .env — add your VITE_ANTHROPIC_API_KEY for the AI Analyst

npm run dev
# → http://localhost:3000
```

### Build for production

```bash
npm run build        # outputs to /dist
npm run preview      # preview the production build locally
```

---

## Environment Variables

Copy `.env.example` to `.env` and set:

| Variable | Required | Description |
|---|---|---|
| `VITE_ANTHROPIC_API_KEY` | For AI Analyst | Your Anthropic API key from [console.anthropic.com](https://console.anthropic.com/settings/api-keys) |
| `VITE_API_BASE_URL` | Optional | Backend API URL (defaults to localhost) |
| `VITE_APP_ENV` | Optional | `development` \| `staging` \| `production` |

> ⚠️ **Security note:** The Anthropic API key is used client-side in this demo. For production, proxy all AI requests through your backend to keep the key server-side.

---

## Project Structure

```
secureops/
├── src/
│   ├── main.jsx          # React entry point
│   └── SecureOps.jsx     # Full application (10,000+ lines, 25 views)
├── public/
│   └── favicon.svg
├── .github/
│   └── workflows/
│       └── ci.yml        # GitHub Actions: lint + build on every push
├── .env.example          # Environment variable template
├── .eslintrc.cjs
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## Deployment

### Netlify (recommended)

```bash
npm install -g netlify-cli
netlify login
netlify init          # follow prompts, set build command: npm run build, publish dir: dist
netlify env:set VITE_ANTHROPIC_API_KEY sk_live_...
netlify deploy --prod
```

### Vercel

```bash
npm install -g vercel
vercel login
vercel                # follow prompts
vercel env add VITE_ANTHROPIC_API_KEY
vercel --prod
```

### Docker

```bash
docker build -t secureops .
docker run -p 3000:80 -e VITE_ANTHROPIC_API_KEY=sk_live_... secureops
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + hooks |
| Build | Vite 5 + esbuild |
| Styling | CSS-in-JS (inline styles) — no external CSS framework |
| Fonts | JetBrains Mono · Rajdhani (Google Fonts) |
| AI | Anthropic Claude Sonnet (claude-sonnet-4-20250514) |
| CI/CD | GitHub Actions |

---

## Development

```bash
npm run dev        # start dev server on :3000
npm run lint       # ESLint check
npm run lint:fix   # auto-fix lint issues
npm run build      # production build
npm run preview    # preview production build
```

---

## Contributing

This is a private project for ZolexTech & Consultant. For access or questions:

- **Email:** security@zolextech.com
- **Owner:** Adebayo Paul Oke

---

## License

UNLICENSED — All rights reserved. © 2026 ZolexTech & Consultant.
