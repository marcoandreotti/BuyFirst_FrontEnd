import { RegionDto } from "../regions/region.dto";
import { AddressDto } from "./address.dto";
import { ResponsibleDto } from "./responsible.dto";

export class SupplierDto {
  supplierId: number;
  active?: boolean | any;
  document: any;
  name: any;
  stateRegistration?: string | any;
  tradingName: any;
  type?: number | any;
  minimumBillingAmount: number | 0;

  regions: RegionDto[] | any;
  contractAccepted: boolean | false;
  addresses?: AddressDto[] | any;
  responsibles?: ResponsibleDto[] | any;
}
