import { Brand } from "../brand/brand";
import { UnitOfMeasure } from "../unit-of-measure/unit-of-measure";
import { ProductSupplierFile } from "./product-supplier-file";

export class ProductSupplier {
  productSupplierId: number;
  barcode: string;
  brandId: number;
  companyId: number;
  description: string;
  externalCode: string;
  name: string;
  referenceCode: string;
  originalCode : string;
  rate: number;
  active: boolean;
  unitOfMeasureId: number;
  brand: Brand;
  company?: any;
  unitOfMeasure?: UnitOfMeasure | any;
  productSupplierLinks: any[];
  createdBy: string;
  created: Date;
  lastModifiedBy?: string | any;
  lastModified?: Date | any;
  height: number | 0;
  width: number | 0;
  length: number | 0;
  weight: number | 0;
  files: ProductSupplierFile[] | any;
  //Aux
  unitOfMeasureName: string;
  unitOfMeasureAcronym: string;
}
