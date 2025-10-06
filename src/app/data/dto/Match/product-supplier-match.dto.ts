import { ProductMatchDto } from "./product-match.dto";

export class ProductSupplierMatchDto {
  productSupplierId: number;
  companyId: number;
  companyName: string;
  description: string;
  externalCode: string;
  name: string;
  referenceCode: string;
  active: boolean;
  brandId: number;
  brandName: string;
  unitOfMeasureId: number;
  unitOfMeasureAcronym: string;
  // createdBy: string;
  // created: Date;
  // lastModifiedBy: string;
  // lastModified: Date;
  
  //AUX
  productMatchs: ProductMatchDto[] | any;
  message: string | null;
}
