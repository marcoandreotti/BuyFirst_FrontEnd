import { PaymentConditionDto } from "@data/dto/payment-condition/payment-condition.dto";
import { AddressDto } from "@data/dto/persons/address.dto";
import { OrderSolProductDto } from "./order-sol-product.dto";

export class OrderSolDto {
    orderSolId: number;
    buyerId: number;
    paymentConditionSupplierId: number;
    billingAddressId: number;
    deliveryAddressId: number;
    externalApplicationId: number;
    openingDate: Date;
    note: string;
    phase: number;
    products: OrderSolProductDto[];
    buyerName: string;
    supplierName: string;
    billingAddress: AddressDto;
    deliveryAddress: AddressDto;
    paymentCondition: PaymentConditionDto;

    supplierLocation: string;
    amount: number;
    totalTaxes: number;
}