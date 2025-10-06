export class CatalogProductWaitingQueueDto {
  catalogProductWaitingQueueId: number;
  created: string;
  externalCode: string;
  referenceCode: string;
  productName: string | null;
  brandName: string;
  deliveryTime: number;
  availableQuantity: number;
  salesMaximumQuantity: number | null;
  salesMinimumQuantity: number | null;
  price: number | null;
  minimumPrice: number | null;
  maximumPrice: number | null;
  unitOfMeasureAcronym: string;
  message: string;
}
