export class QuoteErpBuyerGroupDto {
  buyerId: number;
  buyerName: string;
  buyerTradingName: string;
  buyerDocument: string;
  products: QuoteErpProductGroupDto[];
  quantityQuote: number;
}

export class QuoteErpProductGroupDto {
  productErpId: number;
  productId: number | null;
  productErpCode: string;
  productName: string;
  unitOfMeasureAcronym: string;
  foundOffer: boolean;
  foundOrder: boolean;
  historics: QuoteErpGroupHistoricDto[];

  //Aux
  quantityQuote: number | 0;
  quantityBuyer: number | 0;
}

export class QuoteErpGroupHistoricDto {
  referenceCode: string;
  quantity: number;
  quoteCapture: number;
  message: string;
  quoteCaptureDescription: string;
}
