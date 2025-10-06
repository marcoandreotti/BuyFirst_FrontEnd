export class ProductFilteredDto {
    productId: number;
    name: string;
    groupName: string;
    subGroupName: string;
    unitOfMeasureAcronym: string;
    references: string[] | any;
}

export class ProductSelectSearchDto {
    productId: number;
    name: string;
    subGroupId: string;
    unitOfMeasureId: string;
}