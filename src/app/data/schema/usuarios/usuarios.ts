import { CompanyRoles, Role } from "../login/role";
import { PersonUserData } from "./person-user-data";

/* companyType = 0-Management, 1-Supplier, 2-Buyer, 3-Representative  */
export class Usuario {
  id: number;
  companyId: number | null; //TODO: MuliEmpresas virá null
  externalApplicationId: number | null;
  externalApplicationName: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  rolesCompanies: Role[] | any;
  companiesRoles: CompanyRoles[] | any;
  isSupplier: boolean;
  isBuyFirst: boolean;
  isBuyer: boolean;
  isRepresentative: boolean;

  //Aux
  personData: PersonUserData | any;
}
