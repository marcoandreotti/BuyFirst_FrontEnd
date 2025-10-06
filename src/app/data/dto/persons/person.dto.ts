import { AddressDto } from "./address.dto";
import { ResponsibleDto } from "./responsible.dto";

export interface PersonDto {
  document: string;
  externalCode: string;
  municipalRegistration: string;
  name: string;
  stateRegistration: string;
  tradingName: string;
  addresses?: AddressDto[] | any;
  responsibles?: ResponsibleDto[] | any;
}
