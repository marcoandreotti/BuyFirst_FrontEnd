import { Role } from "@data/schema/login/role";
import { AddressDto } from "../persons/address.dto";
import { PersonDto } from "../persons/person.dto";
import { ResponsibleDto } from "../persons/responsible.dto";
import { RegionDto } from "../regions/region.dto";

export class UserDTO {
  id: number;
  
  personId: number | null;
  
  externalApplicationId: number | null;
  externalApplicationName: string | null;
  
  firstName: string;
  lastName: string;
  userName: string;
  email: string;

  person: PersonDto | any;
  roles: Role[] | any;
  
  //Audit
  lockoutEnabled: boolean;
}

export class CompanyUserDto {
  document: string;
  externalCode: string;
  municipalRegistration: string;
  name: string;
  stateRegistration: string;
  tradingName: string;
  addresses: AddressDto[];
  responsibles: ResponsibleDto[] | any;
  companyMatrixDocument: string;
  regions: RegionDto[] | any;
}

