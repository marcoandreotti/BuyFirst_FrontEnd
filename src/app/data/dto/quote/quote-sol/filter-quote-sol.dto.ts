import { FilterPagedDto } from "@data/dto/filter-paged.dto";
import { FilterDto } from "@data/dto/filter.dto";

export class FilterQuoteSolDto extends FilterPagedDto {
    startDate: string;
    endDate: string;
    buyerId?: number | null;
    openingDate: boolean;
    arguments: FilterDto[] | any;
}

export class FilterQuoteSolSearch {
    column: string;
    data: FilterQuoteSolDto;
}
