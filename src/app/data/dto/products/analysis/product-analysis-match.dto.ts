export interface ProductsAnalysisMatchDto {
  productSupplierLinkId: number;
  productId: number;
  productReferenceCodes: string[] | any;
  productName: string;
  productGroupName: string;
  productSubGroupName: string;
  productUnitOfMeasureAcronym: string;
  productSupplierId: number;
  productSupplierReferenceCode: string;
  productSupplierName: string;
  brandName: string;
  productSupplierUnitOfMeasureAcronym: string;
  productReferenceCode: string | null;
}
