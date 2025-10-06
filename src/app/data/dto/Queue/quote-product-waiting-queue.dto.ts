export class QuoteProductWaitingQueueDto {
  quoteErpProductHistoricId: number;
  quoteId: number;
  referenceCode: string;
  productName: string;
  unitOfMeasureAcronym: string;
  quantity: number;
  supplierId: number | null;
  supplierName: string;
  buyerId: number | null;
  buyerName: string;
  message: string;
  quoteCapture: number;
  quoteCaptureDescription: string;
}

export class UnicQuoteProductWaitingQueueDto {
  quoteId: number;
  externalApplicationId: number;
  externalApplicationName: string;
  externalCode: string;
  openingDate: string;
  note: string;
  quoteCreated: string;
  quoteLastModified: string;
  buyerId: number;
  buyerDocument: string;
  buyerName: string;
  quantityQuoteProduct: number;
  totalQuoteProduct: number;
  quantityWaitingQueue: number;
  quoteProductWaitingQueueId: number;
  message: string;
  productName: string;
  quantity: number;
  supplierId: number;
  supplierDocument: string;
  supplierName: string;
  created: string;
  lastModifiedBy: string;
  lastModified: string;
  brandName: string;
  queueStatus: number;
  referenceCodes: string;
  unitOfMeasureAcronym: string;
}