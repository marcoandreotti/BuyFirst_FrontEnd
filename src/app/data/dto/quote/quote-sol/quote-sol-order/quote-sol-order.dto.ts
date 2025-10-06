import { SupplierDto } from "@data/dto/persons/supplier.dto";
import { QuoteSolProductAddressDto } from "../quote-sol-product-address.dto";

export class QuoteSolOrderDto {
    quoteSolId: number;
    buyerId: number;
    suppliers: QuoteSolOrderSupplierDto[];
}

export class QuoteSolOrderSupplierDto {
    supplier: SupplierDto;
    products: QuoteSolOrderProductDto[];
    paymentDescription: string;
    freightType: number;
    totalWithOutTaxe: number;
    totalWithTaxe: number;
    quantityProducts: number;
    freightTypeDescription: string;
}

export class QuoteSolOrderProductDto {
    quoteSolProductId: number;
    quoteSolProductRetryId: number;
    externalApplicationId: number;
    openingDate: string;
    retryDate: string;
    groupName: string;
    referenceCode: string;
    brandName: string;
    productName: string;
    deliveryTime: number;
    quantity: number;
    price: number;

    taxesIcms: number;
    taxesIcmsST: number;
    taxesIPI: number;
    taxesDifal: number;
    discount: number;
    taxes: number;

    brandNote?: string | null;
    productNote?: string | null;

    phase: number;
    rate: number;
    unitOfMeasureAcronym: string;
    totalWithOutTaxe: number;
    totalWithTaxe: number;

    deliveryAddresses: QuoteSolProductAddressDto[] | any;
}