import { CatalogProduct } from "./catalog-product";
import { CatalogStatus } from "./catalog-status";

export class Catalog {
  catalogId: number;
  companyId: number;
  description: string;
  name: string;
  startDate: string;
  expirationDate: string;
  active: boolean;
  createdBy: string;
  created: string;
  lastModifiedBy: string;
  lastModified: string;
  quantityProducts: number;
  quantityPrices: number;
  overallStatusId: number;
  statusName: string;
  actualStatus: CatalogStatus;
  productWaitingQueues: any;
  products: CatalogProduct[] | any;
  externalApplicationId: any;
}
