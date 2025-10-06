export class Role {
  companyId: number;
  role: string;
  companyType: number;
  companyName: string;
  companyDocument: string;
  companyTradingName: string;
}

export class CompanyRoles {
  companyId: number;
  companyType: number;
  companyName: string;
  companyDocument: string;
  companyTradingName: string;
  roles: string[] | any;
}