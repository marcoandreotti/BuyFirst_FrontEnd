import { CompanyDto } from "@data/dto/companies/compnay.dto"
import { UnitOfMeasureDto } from "@data/dto/products/unit-of-measures/unit-of-measures.dto"

export class QuoteSolProductRetryDto {
  quoteSolProductRetryId: number;
  quoteSolProductId: number;
  supplierId: number;
  externalApplicationId: number;
  openingDate: string;
  retryDate: string;
  productErpCode: number;
  groupName: string;
  referenceCode: string;
  brandName: string;
  productName: string;
  unitOfMeasureId: number;
  deliveryTime: number;
  quantity: number;
  price: number;

  taxesIcms: number;
  taxesIcmsST: number;
  taxesIPI: number;
  taxesDifal: number;
  discount: number;
  
  brandNote?: string | null;
  productNote?: string | null;

  taxes: number; //Soma

  phase: number;
  phaseNote: string;
  
  supplier: CompanyDto;
  unitOfMeasure: UnitOfMeasureDto;
  rate: number | 0;
  
  //AUX
  winner: boolean | false;
}