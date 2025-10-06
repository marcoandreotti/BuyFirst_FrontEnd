import { UnitOfMeasure } from './unit-of-measure/unit-of-measure';
import { ProductReference } from './product-references/product-reference';
import { SubGroup } from './sub-groups/sub-group';

export class Product {
  productId: number;
  companyManagementId: number;
  description: string;
  name: string;
  rate: number;
  tag: string;
  active: boolean;
  subGroup: SubGroup;
  unitOfMeasure: UnitOfMeasure;
  productReferences: ProductReference[];
  createdBy: string;
  created: Date;
  lastModifiedBy?: any;
  lastModified?: any;
  groupId: number;
  subGroupId: number;
  unitOfMeasureId: number;
  referenceCodes: string[];
}
