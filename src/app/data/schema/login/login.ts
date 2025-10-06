import { CompaniesSelected } from "./companies-selected";
import { Role } from "./role";

/* companyType = 0-Management, 1-Supplier, 2-Buyer, 3-Representative  */
export class Login {
  id: number;
  companyId: number | null; //TODO: MuliEmpresas virá null 
  externalApplicationId: number;
  externalApplicationName: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: Role[];
  isVerified: boolean;
  jwToken: string;
  refreshToken: string;
  isSupplier: boolean;
  isBuyFirst: boolean;
  isBuyer: boolean;
  companiesSelected: CompaniesSelected[];
}