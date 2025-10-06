import { OverallStatus } from "@data/schema/overall-status/overall-status";

export class CatalogStatusDto {
  catalogStatusId: number;
  statusDescription: string;
  createdBy: string;
  created: Date;

  //Aux
  overallStatus: OverallStatus;
}
