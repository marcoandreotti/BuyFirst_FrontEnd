export class FishingSearch {
  argument: string | null;
  referenceCode: string | null;
  onlyFavorites: boolean | null;
  onlyShoppingCarts: boolean | null;

  //Aux
  pageNumber: number;
  pageSize: number;
  resultTypeStyle: string | null; // list or grid
}
