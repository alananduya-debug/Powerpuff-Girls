# Security and encryption

## Invoice OCR

- `OCR_MODE` defaults to `cached`; the workspace owner can switch between `cached` and `live` in Settings. The selected mode is saved in the local settings table and takes precedence over the environment default.
- Cached mode matches the uploaded filename to one of the six synthetic sample results and does not call an external OCR service.
- Live mode sends invoice text or image data to the configured Runpod serverless OpenAI-compatible endpoint. For PDFs, the server first reads embedded text; when little or no text is available, it rasterizes at most the first three pages before sending them.
- Configure `RUNPOD_API_KEY`, `RUNPOD_ENDPOINT_ID`, and `RUNPOD_MODEL` as Replit Secrets. The key is used only in the server-side Authorization header and is never sent to the browser or written to logs. The settings page reports only whether the required values are present.
- The upload screen waits up to 90 seconds for OCR. If live OCR fails, the server uses a filename-matched cached sample when available; otherwise it returns a generic safe error.
- Model-reported confidence is ignored. Field confidence is calculated in the server from missing values, known supplier matches, and arithmetic checks.
- In live mode, invoice contents are transmitted to Runpod for processing. Review Runpod's retention, region, and data-processing terms before uploading real invoices. Cached mode keeps OCR processing local.
- Extracted sensitive values are encrypted before database persistence. The raw uploaded file is AES-256-GCM encrypted before it is written to the private upload directory.

## What is encrypted

The API encrypts each stored supplier TIN, invoice number, line-item description, line-item amount, subtotal, tax amount, and total with Node's `crypto` AES-256-GCM. Each value gets a fresh 12-byte random IV and a 16-byte authentication tag. Ciphertext, IV, and tag are stored together in the SQLite record. An authentication failure produces a generic error; the API does not log decrypted values or key material.

Uploaded invoice bytes are encrypted with AES-256-GCM before the encrypted file is written to `artifacts/api-server/private_uploads/`. This directory is outside the web app's public assets and is excluded from Git and deployment context. The API checks the current simulated hub user before decrypting a file and returns the plaintext only in the authorized file response. Plaintext file bytes are not written to disk.

Invoice lists and detail responses return masked TINs and invoice numbers, and do not return descriptions, amounts, or totals. A reveal request decrypts one field at a time and is available to Accountant and Owner roles only. Each successful reveal is recorded with the actor, field name, and timestamp. Owner-only CSV and JSON exports decrypt approved records for the export response and add an export activity entry.

## Duplicate detection

The database stores a blind index for the supplier ID and normalized invoice number. The index is an HMAC-SHA256 value computed with `HMAC_KEY`, separate from the AES key. Duplicate checks compare the blind index rather than storing or searching invoice numbers in plaintext. A blind index exposes whether two records have the same supplier/invoice-number pair, but not the original value without the HMAC key.

## Key handling

- Set `ENCRYPTION_KEY` and `HMAC_KEY` as Replit Secrets. They are required; the server does not provide a development fallback.
- `ENCRYPTION_KEY` must be 64 hexadecimal characters (32 bytes).
- `HMAC_KEY` must be a separate random secret of at least 32 bytes.
- Never commit, print, or include either key in error messages. The application does not display or log key values.
- Keep both keys available to the environment that needs to read the database and encrypted files. Losing the encryption key makes existing encrypted values and files unreadable.
- This demo does not implement key rotation or re-encryption. Replacing either key without a planned migration breaks reads (and changing the HMAC key also prevents matching existing blind indexes). Back up the protected data and design a key migration before changing keys.

## Limits and deployment notes

- The hub and role switcher are simulated. The `X-Demo-User-Id` header selects among demo users and is not proof of identity. A real deployment must replace it with trusted authentication and derive the current role from the verified hub session.
- This project uses local SQLite and a local private-file directory. Their durability depends on the runtime filesystem. For durable production uploads, use persistent private storage and a backup/restore plan.
- Supplier names, dates, currency, status, confidence values, warning messages, masked suffixes, comments, and audit metadata are not encrypted by this feature. The included values are synthetic; do not use real customer records until the storage, authentication, retention, and backup design has been reviewed for that use.
- The in-memory reveal and export response necessarily contains plaintext for the authorized operation. Use HTTPS in any deployed environment and avoid copying revealed values into comments or support logs.
- The reference tax rate is configurable demo data, not a legal or tax recommendation. Tax treatment is decided by your accountant.
