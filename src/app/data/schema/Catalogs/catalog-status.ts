import { OverallStatus } from '@data/schema/overall-status/overall-status';

export class CatalogStatus {
  catalogStatusId: number;
  catalogId: number;
  overallStatusId: number;
  statusDescription: string;
  createdBy: string;
  created: Date;
  lastModifiedBy: string | any;
  lastModified: Date | any;

  overallStatus: OverallStatus;
}
