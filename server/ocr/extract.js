import path from "node:path";
import extractions from "../data/extractions.json" with { type: "json" };

const INVOICE_INSTRUCTION =
  "Extract this invoice (English, Chinese or Malay). Return ONLY valid JSON with: supplier_name, supplier_tin, invoice_number, date (YYYY-MM-DD), currency, line_items [{description, quantity, unit_price, amount}], subtotal, tax_amount, total. Use null for anything you cannot read. Do not guess.";
const PDF_TEXT_MIN_LENGTH = 80;
const MAX_PDF_PAGES = 3;

function cachedForFilename(fileName) {
  const normalizedName = path.basename(fileName).toLowerCase();
  const cached = extractions.find(
    (entry) => path.basename(entry.fileName).toLowerCase() === normalizedName,
  );
  return cached ? structuredClone(cached) : undefined;
}

function normalizeText(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function normalizeNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function parseModelJson(content) {
  if (typeof content !== "string") return null;
  const withoutFence = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  try {
    return JSON.parse(withoutFence);
  } catch {
    const firstBrace = withoutFence.indexOf("{");
    const lastBrace = withoutFence.lastIndexOf("}");
    if (firstBrace < 0 || lastBrace <= firstBrace) return null;
    try {
      return JSON.parse(withoutFence.slice(firstBrace, lastBrace + 1));
    } catch {
      return null;
    }
  }
}

function knownSupplierMatch(supplierName, knownSuppliers) {
  const normalized = (supplierName ?? "").trim().toLocaleLowerCase();
  return Boolean(
    normalized &&
      knownSuppliers.some(
        (supplier) => supplier.name.trim().toLocaleLowerCase() === normalized,
      ),
  );
}

function confidenceFor(extraction, knownSuppliers) {
  const lineItems = Array.isArray(extraction.line_items)
    ? extraction.line_items
    : [];
  const numericFields = [
    extraction.subtotal,
    extraction.tax_amount,
    extraction.total,
    ...lineItems.map((line) => line.amount),
  ];
  const allNumbersPresent = numericFields.every(
    (value) => typeof value === "number" && Number.isFinite(value),
  );
  const lineSum = lineItems.reduce((sum, line) => sum + (line.amount ?? 0), 0);
  const arithmeticValid =
    allNumbersPresent &&
    Math.abs(lineSum - extraction.subtotal) <= 0.01 &&
    Math.abs(extraction.subtotal + extraction.tax_amount - extraction.total) <=
      0.01;
  const confidence = {};
  const values = {
    supplier_name: extraction.supplier_name,
    supplier_tin: extraction.supplier_tin,
    invoice_number: extraction.invoice_number,
    date: extraction.date,
    currency: extraction.currency,
    subtotal: extraction.subtotal,
    tax_amount: extraction.tax_amount,
    total: extraction.total,
  };
  for (const [field, value] of Object.entries(values)) {
    if (value === null || value === undefined || value === "") {
      confidence[field] = "Low";
    } else if (
      ["subtotal", "tax_amount", "total"].includes(field) &&
      !arithmeticValid
    ) {
      confidence[field] = "Low";
    } else if (
      field === "supplier_name" &&
      !knownSupplierMatch(extraction.supplier_name, knownSuppliers)
    ) {
      confidence[field] = "Medium";
    } else {
      confidence[field] = "High";
    }
  }
  confidence.line_items = lineItems.map((line) => ({
    description: line.description ? "High" : "Low",
    quantity: line.quantity === null ? "Low" : "High",
    unit_price: line.unit_price === null ? "Low" : "High",
    amount:
      line.amount === null || !arithmeticValid ? "Low" : "High",
  }));
  return confidence;
}

function normalizeExtraction(raw, knownSuppliers, fileName) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const rawLines = Array.isArray(raw.line_items) ? raw.line_items : [];
  const lineItems = rawLines.map((line) => ({
    description: normalizeText(line?.description),
    quantity: normalizeNumber(line?.quantity),
    unit_price: normalizeNumber(line?.unit_price),
    amount: normalizeNumber(line?.amount),
  }));
  const result = {
    fileName,
    supplier_name: normalizeText(raw.supplier_name),
    supplier_tin: normalizeText(raw.supplier_tin),
    invoice_number: normalizeText(raw.invoice_number),
    date: normalizeText(raw.date),
    currency: normalizeText(raw.currency),
    line_items: lineItems,
    subtotal: normalizeNumber(raw.subtotal),
    tax_amount: normalizeNumber(raw.tax_amount),
    total: normalizeNumber(raw.total),
  };
  result.confidence = confidenceFor(result, knownSuppliers);
  return result;
}

async function readPdf(fileBuffer) {
  const [{ getDocument }, { createCanvas }] = await Promise.all([
    import("pdfjs-dist/legacy/build/pdf.mjs"),
    import("@napi-rs/canvas"),
  ]);
  const pdf = await getDocument({
    data: new Uint8Array(fileBuffer),
    disableFontFace: true,
    isEvalSupported: false,
    useSystemFonts: true,
  }).promise;
  const textParts = [];
  for (let pageNumber = 1; pageNumber <= Math.min(pdf.numPages, MAX_PDF_PAGES); pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    textParts.push(
      content.items
        .map((item) => ("str" in item ? item.str : ""))
        .filter(Boolean)
        .join(" "),
    );
  }
  const text = textParts.join("\n").trim();
  if (text.length >= PDF_TEXT_MIN_LENGTH) {
    return { text: text.slice(0, 24_000), images: [] };
  }

  const images = [];
  for (let pageNumber = 1; pageNumber <= Math.min(pdf.numPages, MAX_PDF_PAGES); pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = createCanvas(
      Math.ceil(viewport.width),
      Math.ceil(viewport.height),
    );
    await page.render({ canvas, canvasContext: canvas.getContext("2d"), viewport }).promise;
    images.push(`data:image/png;base64,${canvas.toBuffer("image/png").toString("base64")}`);
  }
  return { text: "", images };
}

async function imageDataUrl(file) {
  const mimeType = file.mimeType.toLowerCase();
  if (mimeType === "image/svg+xml" || path.extname(file.fileName).toLowerCase() === ".svg") {
    const [{ createCanvas, loadImage }] = await Promise.all([
      import("@napi-rs/canvas"),
    ]);
    const image = await loadImage(file.buffer);
    const canvas = createCanvas(image.width, image.height);
    canvas.getContext("2d").drawImage(image, 0, 0);
    return `data:image/png;base64,${canvas.toBuffer("image/png").toString("base64")}`;
  }
  return `data:${mimeType};base64,${file.buffer.toString("base64")}`;
}

async function callRunpod({ images, text }) {
  const apiKey = process.env.RUNPOD_API_KEY;
  const endpointId = process.env.RUNPOD_ENDPOINT_ID;
  const model = process.env.RUNPOD_MODEL;
  if (!apiKey || !endpointId || !model) {
    throw new Error("Live invoice reading is not configured.");
  }
  const userContent = images.length
    ? [
        { type: "text", text: INVOICE_INSTRUCTION },
        ...images.map((image_url) => ({
          type: "image_url",
          image_url: { url: image_url },
        })),
      ]
    : `${INVOICE_INSTRUCTION}\n\nInvoice text:\n${text}`;
  const response = await fetch(
    `https://api.runpod.ai/v2/${encodeURIComponent(endpointId)}/openai/v1/chat/completions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        messages: [{ role: "user", content: userContent }],
      }),
      signal: AbortSignal.timeout(90_000),
    },
  );
  if (!response.ok) {
    throw new Error("Invoice reading service returned an unavailable response.");
  }
  const payload = await response.json();
  return parseModelJson(payload?.choices?.[0]?.message?.content);
}

/**
 * Read an invoice from Runpod or a filename-matched saved fixture.
 * The API key and extracted invoice content are never logged.
 */
export async function extractInvoice(
  file,
  { mode = process.env.OCR_MODE ?? "cached", knownSuppliers = [] } = {},
) {
  const fileName = path.basename(file.fileName ?? "invoice-upload");
  const cached = cachedForFilename(fileName);
  if (mode !== "live") {
    if (!cached) {
      return { error: "No saved extraction matches this filename.", source: "cached" };
    }
    const matchedSupplier = knownSuppliers.find(
      (supplier) => supplier.id === cached.supplierId,
    );
    return {
      fileName,
      supplier_name: matchedSupplier?.name ?? null,
      supplier_tin: cached.supplierTin || null,
      invoice_number: cached.invoiceNumber || null,
      date: cached.date || null,
      currency: cached.currency || null,
      line_items: cached.lineItems.map((line) => ({
        description: line.description ?? null,
        quantity: null,
        unit_price: null,
        amount: line.amount ?? null,
      })),
      subtotal: cached.subtotal ?? null,
      tax_amount: cached.tax ?? null,
      total: cached.total ?? null,
      confidence: confidenceFor(
        {
          supplier_name: matchedSupplier?.name ?? null,
          supplier_tin: cached.supplierTin || null,
          invoice_number: cached.invoiceNumber || null,
          date: cached.date || null,
          currency: cached.currency || null,
          line_items: cached.lineItems.map((line) => ({
            description: line.description ?? null,
            quantity: null,
            unit_price: null,
            amount: line.amount ?? null,
          })),
          subtotal: cached.subtotal ?? null,
          tax_amount: cached.tax ?? null,
          total: cached.total ?? null,
        },
        knownSuppliers,
      ),
      source: "cached",
    };
  }

  try {
    const mimeType = file.mimeType?.toLowerCase() ?? "";
    let input;
    if (mimeType === "application/pdf" || path.extname(fileName).toLowerCase() === ".pdf") {
      input = await readPdf(file.buffer);
    } else if (mimeType.startsWith("image/") || /\.(png|jpe?g|webp|svg)$/i.test(fileName)) {
      input = { text: "", images: [await imageDataUrl(file)] };
    } else {
      throw new Error("Choose a supported invoice image or PDF.");
    }
    const raw = await callRunpod(input);
    const result = normalizeExtraction(raw, knownSuppliers, fileName);
    if (!result) {
      throw new Error("Invoice reading returned an invalid result.");
    }
    return { ...result, source: "live" };
  } catch {
    if (cached) {
      const matchedSupplier = knownSuppliers.find(
        (supplier) => supplier.id === cached.supplierId,
      );
      const fallback = await extractInvoice(
        { fileName, mimeType: file.mimeType, buffer: file.buffer },
        { mode: "cached", knownSuppliers },
      );
      return {
        ...fallback,
        supplier_name: matchedSupplier?.name ?? null,
        source: "cached-fallback",
        notice: "Live reading was unavailable; a saved sample extraction was used.",
      };
    }
    return {
      error: "We couldn't read this invoice. Check the file or try again later.",
      source: "failed",
    };
  }
}

export const __private__ = {
  confidenceFor,
  normalizeExtraction,
  parseModelJson,
};

