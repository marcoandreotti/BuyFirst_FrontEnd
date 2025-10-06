import { FilterPagedDto } from "@data/dto/filter-paged.dto";
import { FilterDto } from "@data/dto/filter.dto";

export class FilterQuoteErpHistoricDto extends FilterPagedDto {
    startDate: string;
    endDate: string;
    companyCodeSac?: string | null;
    productErpCode?: string | null;
    productId?: string | null;
    productArguments: FilterDto[] | any;
    buyerArguments: FilterDto[] | any;
}

export class FilterQuoteErpHistoricSearch {
    column: string;
    data: FilterQuoteErpHistoricDto;
}
