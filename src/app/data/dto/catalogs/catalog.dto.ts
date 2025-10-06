import { CatalogProductWaitingQueueResponse } from "./catalog-product-waiting-queue.response";
import { CatalogProductDto } from "./catalog-product.dto";

export class CatalogDto {
  catalogId: number;
  document: string;
  personName: string;
  companyId: number;
  externalApplicationId: number | null;
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
  statusAlias: string;
  qtdProdActive: string;
  products: CatalogProductDto[] | any;
  waitingQueue: CatalogProductWaitingQueueResponse[] | any;
}
