import taxConfig from "./config.json" with { type: "json" };

export type RuleInput = {
  supplier: string;
  invoiceNumber: string;
  date: string;
  supplierTin: string;
  lineItems: Array<{ description: string; amount: number }>;
  subtotal: number;
  tax: number;
  total: number;
  blindIndex: string;
};

export type RuleWarning = {
  code: string;
  severity: "error" | "warning";
  message: string;
  field: string;
};

export function evaluateInvoiceRules(
  invoice: RuleInput,
  existingBlindIndexes: ReadonlySet<string>,
  referenceTaxRate = taxConfig.referenceTaxRate,
): RuleWarning[] {
  const warnings: RuleWarning[] = [];

  if (!invoice.supplier.trim()) {
    warnings.push({
      code: "required_supplier",
      severity: "error",
      message: "Supplier is missing. Choose a supplier record.",
      field: "supplier",
    });
  }
  if (!invoice.invoiceNumber.trim()) {
    warnings.push({
      code: "required_invoice_number",
      severity: "error",
      message: "Invoice number is missing. Check the invoice.",
      field: "invoiceNumber",
    });
  }
  if (!invoice.date.trim() || Number.isNaN(Date.parse(invoice.date))) {
    warnings.push({
      code: "invalid_date",
      severity: "error",
      message: "Invoice date is missing or invalid. Check the invoice date.",
      field: "date",
    });
  } else if (Date.parse(invoice.date) > Date.now()) {
    warnings.push({
      code: "future_date",
      severity: "error",
      message: "Invoice date is in the future. Check the date on the invoice.",
      field: "date",
    });
  }
  if (!invoice.supplierTin.trim()) {
    warnings.push({
      code: "missing_tin",
      severity: "error",
      message: "Supplier TIN is missing. Check the invoice or supplier record.",
      field: "supplierTin",
    });
  }

  const lineSum = invoice.lineItems.reduce((sum, item) => sum + item.amount, 0);
  if (Math.abs(lineSum - invoice.subtotal) > taxConfig.tolerance) {
    warnings.push({
      code: "subtotal_mismatch",
      severity: "error",
      message: "Subtotal does not match the line items. Review the line items.",
      field: "subtotal",
    });
  }
  if (Math.abs(invoice.subtotal + invoice.tax - invoice.total) > taxConfig.tolerance) {
    warnings.push({
      code: "total_mismatch",
      severity: "error",
      message: "Total does not match subtotal plus tax. Check the invoice totals.",
      field: "total",
    });
  }
  if (Math.abs(invoice.tax - invoice.subtotal * referenceTaxRate) > taxConfig.tolerance) {
    warnings.push({
      code: "tax_mismatch",
      severity: "warning",
      message: "Tax amount needs review. Ask your accountant to confirm the treatment.",
      field: "tax",
    });
  }
  if (invoice.blindIndex && existingBlindIndexes.has(invoice.blindIndex)) {
    warnings.push({
      code: "duplicate",
      severity: "error",
      message: "This invoice number may already be recorded for this supplier.",
      field: "invoiceNumber",
    });
  }

  return warnings;
}

export function blocksSubmission(warnings: RuleWarning[]): boolean {
  return warnings.some((warning) => warning.severity === "error");
}
