import { PriceDto } from "./price.dto";

export interface FishingPriceDto {
  companyId: number;
  companyName: string;
  companyTradingName: string;
  catalogProductId: number;
  productSupplierLinkId: number;
  referenceCode: string;
  externalCode: string;
  productSupplierId: number;
  productSupplierName: string;
  productSupplierDescription: string;
  brandName: string;
  unitOfMeasureName: string;
  unitOfMeasureAcronym: string;
  productName: string;
  productDescription: string;
  subGroupId: number;
  subGroupName: string;
  groupId: number;
  groupName: string;
  availableQuantity: number;
  salesMaximumQuantity: number;
  salesMinimumQuantity: number;
  lowestPrice: number;
  favorite: boolean;
  shoppingCart: boolean;
  prices: PriceDto[] | any;

  //AUX
  Quantity: number | 0;
}
