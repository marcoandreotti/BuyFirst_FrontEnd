import { Sort } from "@angular/material/sort";

export class FilterPagedDto {
    pageNumber: number;
    pageSize: number;
    sort: Sort;
}