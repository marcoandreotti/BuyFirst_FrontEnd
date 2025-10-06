import { FilterPagedDto } from "@data/dto/filter-paged.dto";
import { FilterDto } from "@data/dto/filter.dto";

export class FilterProductDto extends FilterPagedDto {
    productId?: string | null;
    situation: number;
    arguments: FilterDto[] | any;
    groupId?: number | null;
    subGroupId?: number | null;
    referenceCode: string | null;
}

export class FilterProductDtoSearch {
    column: string;
    data: FilterProductDto;
}
