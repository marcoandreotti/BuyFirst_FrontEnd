import { PaymentCondition } from "@data/schema/payment-conditions/payment-condition";
import { BuyerDto } from "@data/dto/persons/buyer.dto";
import { SupplierDto } from "@data/dto/persons/supplier.dto";
import { OrderProduct } from "./order-product";
import { OrderStatus } from "./order-status";
import { OrderWaitingQueue } from "./order-waiting-queue";

export class Order {
  orderId: number;
  externalCode: string;
  openingDate: string;
  note: string | null;
  totalOrder: number;
  buyer: BuyerDto | any;
  supplier: SupplierDto | any;
  paymentCondition: PaymentCondition;
  products?: OrderProduct[] | any;
  waitingQueues?: OrderWaitingQueue[] | any;
  statuses?: OrderStatus[] | any;
}












