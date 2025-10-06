export class CatalogProductWaitingQueueResponse {
    catalogProductWaitingQueueId: number;
    catalogId: number;
    created: string;
    createdBy: string;
    availableQuantity: number;
    initialQuantity: number;
    deliveryTime: number;
    externalCode: string;
    salesMaximumQuantity: number | null;
    salesMinimumQuantity: number | null;
    price: number | null;
    minimumPrice: number | null;
    maximumPrice: number | null;
    referenceCodes: string;
    catalogName: string;
    brandName: string;
    queueStatus: number;
    queueStatusDescription: string;
    message: string;
    unitOfMeasureAcronym: string;
  }