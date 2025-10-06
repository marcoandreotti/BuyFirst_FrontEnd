export class SpecialConditionCatalog {
  paymentConditionCatalogId?: number | null;
  restrictConditionType: number;
  cnpj: string | null;
  regionId?: number | null;
  percentageOnPrice: number;
  startDate: Date;
  expirationDate?: Date | null;
}
