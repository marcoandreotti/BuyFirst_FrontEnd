export class CatalogProductDto {
  catalogProductId: number;
  referenceCode: string;
  productName: string;
  brandName: string;
  unitOfMeasureAcronym: string;
  deliveryTime: number;
  externalCode: string;
  quantity: number;
  salesMaximumQuantity?: number | null;
  salesMinimumQuantity: number;
  type: number;
  price: number;
  minimumPrice: number;
  maximumPrice?: number | null;
  active: boolean;
  note?: string| null;

  typeDescription: string;
}
