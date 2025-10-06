export class ProductMatchDto {
  productId: number;
  description: string | null;
  name: string;
  subGroupName: string;
  groupName: string;
  unitOfMeasureAcronym: string;
  referenceCode: string;
  score: number;
  distance: number;

  //AUX
  selected: boolean;

  constructor() {
    this.selected = false;
  }
}

export class ProductSupplierAndProductMatchDto {
  productSupplierId: number;
  productMatchs: ProductMatchDto[];
  message: string | null;
}