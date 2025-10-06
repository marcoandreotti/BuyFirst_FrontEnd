export class CompanyCodeSacDto {
    companyCodeSac: number;
    qtdProduct: number;

    startDate: Date | null;
    endDate: Date | null;

    qtdQuote: number;
    qtdQuoteErpProduct: number;
    qtdQuoteProduct: number;
    qtdOrder: number;
    companies: CompanyErpDto[];
  }
  
  export class CompanyErpDto {
    companyId: number;
    type: number;
    active: boolean;
    document: string;
    name: string;
    tradingName: string;

    startDate: Date | null;
    endDate: Date | null;

    qtdQuote: number;
    qtdQuoteErpProduct: number;
    qtdQuoteProduct: number;
    qtdOrder: number;
    companyTypeDescription: string;
  }
  