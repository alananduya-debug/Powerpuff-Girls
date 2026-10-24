export type OcrMode = "live" | "cached";

export type OcrSupplier = {
  id: string;
  name: string;
  tin: string;
};

export type OcrLineItem = {
  description: string | null;
  quantity: number | null;
  unit_price: number | null;
  amount: number | null;
};

export type OcrExtraction = {
  fileName: string;
  supplier_name: string | null;
  supplier_tin: string | null;
  invoice_number: string | null;
  date: string | null;
  currency: string | null;
  line_items: OcrLineItem[];
  subtotal: number | null;
  tax_amount: number | null;
  total: number | null;
  confidence?: Record<string, unknown>;
  source?: "live" | "cached" | "cached-fallback";
  notice?: string;
};

export function extractInvoice(
  file: { fileName: string; mimeType: string; buffer: Buffer },
  options?: { mode?: OcrMode; knownSuppliers?: OcrSupplier[] },
): Promise<OcrExtraction | { error: string; source: string }>;

export const __private__: {
  confidenceFor(
    extraction: Record<string, any>,
    knownSuppliers: OcrSupplier[],
  ): Record<string, unknown>;
  normalizeExtraction(
    raw: unknown,
    knownSuppliers: OcrSupplier[],
    fileName: string,
  ): OcrExtraction | null;
  parseModelJson(content: unknown): Record<string, unknown> | null;
};
