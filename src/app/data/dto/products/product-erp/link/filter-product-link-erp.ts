import { FilterPagedDto } from "@data/dto/filter-paged.dto";
import { FilterDto } from "@data/dto/filter.dto";

export class FilterProductLinkErp extends FilterPagedDto {
    filter: FilterDto[] | any;
    productId?: string | null;
    argument: string | null;
    showResult: number;
}

export class FilterProductLinkErpSearch {
    column: string;
    data: FilterProductLinkErp;
}
