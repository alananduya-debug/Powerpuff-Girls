# Invoice Assistant

Invoice Assistant is a simulated Orbyte workspace for Malaysian micro and small businesses. It prepares invoices for staff, accountant, and owner review; it does not file invoices with an authority, make payments, or give tax advice. All included records and supplier details are synthetic.

## Start the app

In Replit, click **Run** to start the Invoice Assistant preview and its API server. The app needs the `ENCRYPTION_KEY` and `HMAC_KEY` Replit Secrets to be present before the API starts.

For checks from the workspace terminal:

```sh
pnpm --filter @workspace/api-server run typecheck
pnpm --filter @workspace/api-server run test
```

## Orbyte hub mock assumptions

- The simulated hub is the source of the three demo users and five supplier records.
- The role switcher sends the selected demo user's ID in `X-Demo-User-Id`. The server resolves the ID through the hub mock; it never accepts a role string from the browser.
- An absent or unrecognized demo user ID resolves to Siti (Staff).
- `publishEvent(name, payload)` stores workflow events in the SQLite `events` table.
- Replace this mock adapter with the real Orbyte identity and supplier services before using real business data. The role switcher is for demonstration, not authentication.

## Data and privacy

The six sample invoices are synthetic and include known review cases. Invoice values and uploaded file bytes are encrypted before they are written to the local SQLite database or private upload directory. The database and upload directory are ignored by Git and are not served as static files. Only masked values are included in normal invoice responses. See [docs/security.md](docs/security.md) for the encryption design, key handling, and limitations.

## Invoice OCR

The owner can switch between cached sample extraction and live Runpod OCR in **Settings**. Live mode requires `RUNPOD_API_KEY`, `RUNPOD_ENDPOINT_ID`, and `RUNPOD_MODEL` in Replit Secrets. `OCR_MODE` may set the initial mode (`live` or `cached`); the owner’s in-app choice is saved locally and takes precedence. Live OCR can send invoice text or images to Runpod, so review the provider's data handling terms before using real invoices. A failed live request falls back to a filename-matched cached sample when one exists. See [docs/security.md](docs/security.md) for processing details and limitations.

The reference tax rate is a configurable demo value in `server/rules/config.json`, not tax advice. Tax treatment is decided by your accountant.
