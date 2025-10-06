import { RegionDto } from './../../../dto/regions/region.dto';
import { Address } from "../address";
import { Person } from "../person";
import { Responsible } from "../responsible";
import { CompanyRegionTarget } from "./company-region-target";
import { CompanyConfig99KDto } from '@data/dto/companies/company-config-99k.dto';

export class Company {
  companyId: number;
  companyMatrixId?: number | null;
  dayForPayment: number;
  type: number;
  typeName: string;
  active: boolean;
  person: Person;
  regionTargets: CompanyRegionTarget[] | any;
  contractAccepted: boolean | false;
  optingSimple: boolean | false;
}

export class CompanyBase {
  companyId: number;
  companyCodeSac: number | null;
  document: string;
  externalCode: string;
  municipalRegistration: string;
  name: string;
  stateRegistration: string;
  tradingName: string;
  addresses: Address[] | any;
  responsibles: Responsible[] | any;
  companyMatrixDocument: string;
  regions: RegionDto[] | any;
  active: boolean;
  contractAccepted: boolean | false;
  optingSimple: boolean | false;

  config99K: CompanyConfig99KDto | any;
}

