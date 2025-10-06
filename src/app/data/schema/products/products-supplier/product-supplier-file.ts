import { FileBase } from "./file-base";

export class ProductSupplierFile extends FileBase {
    productSupplierFileId : number; 
    productSupplierId : number; 
    defaut: boolean; 
    sequence: number; 

    //Aux
    deleted: boolean | false;
  }