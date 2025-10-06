export class BfResponse<Response> {
  succeeded: boolean;
  message: string;
  errors: any;
  data?: Response;
  totalPages: number;

  totalRecords: number;
  totalFavorites: number;
  totalShoppingCarts: number;
}