# Invoice Assistant

> An AI-assisted invoice review tool for Malaysian micro and small businesses, built for the Orbyte hub. Staff upload supplier bills, the system reads and checks them, and an accountant and owner approve a clean, logged record. It prepares records only: it never files, pays or gives tax advice.

---

## Team Information

| Field | Details |
|---|---|
| **Team Name** | Powerpuff Girls |
| **Team Domain** | Domain 2: Orbyte Smart SME Challenge (Less Busywork, Better Business) |
| **SDG Track** | SDG 8: Decent Work and Economic Growth (targets 8.2 and 8.3); supporting SDG 9 |
| **Team Leader** | Aisuluu Abdullaeva |
| **University** | Xiamen University Malaysia |
| **Number of Members** | 3 |

## Links

| Resource | Link |
|---|---|
| GitHub Repository | https://github.com/alananduya-debug/Powerpuff-Girls |
| Live Demo | https://invoice-assistant-workflow-fixes-and-demo.replit.app/settings |
| RunPod Endpoint | Private (requires an API key); see `submission/RunPod Proof of Use.pdf` |
| Slide Deck | https://www.canva.com/design/DAHY5GeAKRM/3WwtZlKP5aQZqOfBez-auw/edit |
| Demo / Pitch Video | [link] |

---

## Problem

Many Malaysian micro and small businesses manage supplier bills through WhatsApp photos, paper receipts and spreadsheets, in a mix of English, Chinese and Malay. Checking each bill by hand causes typing errors, duplicate records, totals that don't add up and missing supplier details, usually found late at month-end.

**Baseline:** manual handling takes roughly 12 minutes of hands-on work per invoice, with manual data-entry error rates of about 1 to 4% (published industry benchmarks; see `submission/SDC2026_[TeamName]_Preliminary.pdf` for sources). 

## Solution

Invoice Assistant turns a supplier bill into a checked, approved and logged record:

| Step | What happens |
|---|---|
| **Trigger** | Staff upload a photo or PDF of a supplier bill |
| **Connected data** | OCR extracts supplier, invoice number, date, currency, line items, tax and total; supplier data comes from the hub layer |
| **Decision logic** | Transparent rules check required fields, duplicates, arithmetic and tax amounts. AI is used only to read documents. Uncertain fields are flagged, not guessed |
| **Human approval** | Accountant reviews and corrects; the owner gives final approval |
| **Visible outcome** | A validated record appears in the records table, can be exported as CSV or JSON, and every step is written to the activity log |

## Key Features

- OCR extraction from images and PDFs (English and Chinese; Bahasa Melayu is a planned target)
- Plain-language warnings (for example, "Total doesn't match the line items, off by RM 4.50")
- Duplicate detection, arithmetic checks and tax-amount checks with configurable rules
- Three roles with server-enforced permissions: **Staff** (upload and fix), **Accountant** (review), **Owner** (final approval and export). The same person cannot submit and finally approve a record
- Append-only activity log of extractions, edits, approvals, reveals and exports
- Encrypted sensitive fields (AES-256-GCM), masked values with a logged "Reveal", and an HMAC blind index so duplicate detection still works
- OCR mode: live (Runpod) or demo (saved results), with automatic fallback

## Fit with Orbyte

The app talks to the hub only through one adapter (`/server/hub-mock`) that provides users, roles, a supplier directory and an event feed (`invoice.approved`). In this prototype the hub is **simulated**; connecting to the live Orbyte hub is a configuration change. The workflow follows Orbyte's Submit, Review, Approve pattern, and the validation rules are configuration, so the same product can serve many SMEs.

## How We Used Replit and RunPod

### Replit (application and hosting)
- **Development:** the whole app (React frontend, Node/Express backend, SQLite database, rules engine, role permissions, encryption and activity log) was built and run in a single Replit project. We used the Replit Agent to scaffold screens and features, then reviewed and tested each change ourselves.
- **Hosting:** the app is deployed on Replit at the Live Demo link above.
- **Secrets:** all keys (`ENCRYPTION_KEY`, `HMAC_KEY` and the RunPod values) are stored in Replit Secrets and are never committed to the repository.
- **Data:** the database is seeded with synthetic invoices only.
- **Proof of use:** deployment and AI credit usage screenshots are in `submission/Replit Proof of Use.pdf`.

### RunPod (AI document reading)
- **What runs there:** a serverless endpoint hosting an open vision-language model [model name, e.g. Qwen2.5-VL], which reads invoice images and returns structured JSON (supplier, invoice number, date, currency, line items, tax, total).
- **How the app calls it:** the backend (`/server/ocr/extract.js`) sends the invoice image to the RunPod endpoint through an OpenAI-compatible API and parses the JSON reply. PDFs with embedded text are read directly; scanned PDFs are converted to images first.
- **What AI does and doesn't do:** the model is used only to read documents. All checking (duplicates, arithmetic, tax, required fields) is done by plain, testable rules, and every approval is made by a person.
- **Fallback:** if the endpoint is slow, unavailable or returns unreadable output, the app shows a friendly message and uses saved results (`OCR_MODE=cached`). Demo mode is labelled in the interface.
- **Results so far:** [e.g. "Tested on N synthetic invoices in English and Chinese; M extracted correctly without edits." Delete this line if you haven't measured it.]
- **Proof of use:** endpoint and GPU usage/billing screenshots are in `submission/RunPod Proof of Use.pdf`.

### Built With
React, Tailwind CSS, Node.js, Express, SQLite, Replit (development, Agent and hosting), RunPod Serverless with a vision-language model, GitHub.

## Impact and SDG

- **SDG 8.2 / 8.3:** productivity through technology, and support for micro and small enterprises.
- **KPI:** hands-on minutes per invoice, from upload to approved record. Secondary: percentage of planted errors flagged before approval.
- **Phase 2 target (to be validated):** 50% less hands-on time per invoice and at least 90% of planted errors flagged.


## Architecture

```
Browser (React) ──► API server (Node/Express, SQLite)
                     ├─ Rules engine (/server/rules)
                     ├─ Encryption + audit log
                     ├─ Hub adapter (/server/hub-mock): users, roles, suppliers, events
                     └─ OCR service ──► Runpod serverless endpoint (vision-language model)
```

## How to Run

**Live demo:** open the Live Demo link above and use the role switcher (Siti = Staff, Mr Tan = Accountant, Ms Lim = Owner).

**Run locally**

```bash
git clone [https://github.com/your-username/your-repo.git]
cd [your-repo]
npm install
cp .env.example .env     # then fill in the values below
npm run dev              # [replace with the actual start command from package.json]
```

**Environment variables / secrets** (never commit real values):

| Name | Purpose |
|---|---|
| `ENCRYPTION_KEY` | 64-character hex key for AES-256-GCM (`openssl rand -hex 32`) |
| `HMAC_KEY` | separate 64-character hex key for the duplicate-detection blind index |
| `RUNPOD_API_KEY` | Runpod API key (only needed for live OCR) |
| `RUNPOD_ENDPOINT_ID` | Runpod serverless endpoint ID |
| `RUNPOD_MODEL` | model name served by the endpoint |
| `OCR_MODE` | `cached` (saved results, no Runpod needed) or `live` |

The app runs fully without Runpod by using `OCR_MODE=cached`.

**Tests:** `npm test` [adjust if different]

## Data and Privacy

- **All data is synthetic.** No real personal, customer or company records are used.
- **In a real deployment** we would follow PDPA principles: encryption in transit and at rest, role-based access, data minimisation, limited retention, user access and correction rights, and external AI providers under data processing agreements with limited retention. This is a design intent, not a compliance claim.
- **Boundaries:** the product prepares and explains. It does not file with any authority, process payments or give tax or legal advice.

## Known Limitations

- The Orbyte hub (users, roles, suppliers, events) is simulated; roles are switched with a dropdown.
- OCR accuracy drops on handwritten or crumpled bills. Low-confidence fields are routed to a person, and saved results are the demo fallback.
- Bahasa Melayu support, WhatsApp intake and live hub integration are planned, not built.
- Encryption keys live in the same environment as the app (demo-grade); a real deployment would use a managed key service.
- Confidence badges combine rule checks and field completeness, not the model's own self-reported confidence.

## Roadmap

1. **Prove it:** core journey, roles, log, encryption (this prototype)
2. **Connect it:** live Orbyte hub, WhatsApp intake, Bahasa Melayu
3. **Pilot:** real SMEs, supplier memory, accuracy dashboard, measured results
4. **Make it act:** due-date list, price-change alerts, accounting export (reminders only)
5. **Platform:** extraction and validation API, accountant multi-client view, configurable rule packs
6. **Expand:** more document types, own-sales invoice preparation, other ASEAN markets

## Team

| Team Members |
|---|
| Aisuluu Abdullaeva |
| Alana Nabwire Duya |
| Sehar Ahmed |

## License

This project is licensed under the [Apache 2.0](LICENSE).
