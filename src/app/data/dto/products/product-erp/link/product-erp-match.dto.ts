export class ProductErpMatchDto {
    productIds: number[];
    description: string;
    name: string;
    productReferences: string;
    subGroupId: number;
    unitOfMeasureId: number;

    //Órfãos
    productErpOrphans: ProductErpOrphansDto[] | null;
  }

  export class ProductErpOrphansDto {
    companyCodeSac: number;
    productErpCode: number;
  }