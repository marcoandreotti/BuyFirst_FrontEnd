import { QuoteSolProductRetryDto } from "@data/dto/quote/quote-sol/quote-sol-product-retry.dto";

export class OrderSolProductDto {
    orderSolProductId: number;
    orderSolId: number;
    quoteSolProductRetryId: number;
    quantity: number;
    phase: number;
    productRetry: QuoteSolProductRetryDto;
}