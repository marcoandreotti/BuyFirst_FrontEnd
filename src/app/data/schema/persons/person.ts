import { Address } from "./address";

export interface Person {
  document: string;
  externalCode: string;
  municipalRegistration?: any;
  name: string;
  stateRegistration: string;
  tradingName: string;
  addresses: Address[];
  responsibles: any[];
}
