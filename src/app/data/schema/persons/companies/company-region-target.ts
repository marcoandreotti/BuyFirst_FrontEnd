import { Region } from "@data/schema/Regions/region";

export class CompanyRegionTarget {
  companyRegionTargetId: number;
  companyId: number;
  regionId: number;

  region: Region | any;
}