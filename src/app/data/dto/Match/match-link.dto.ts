export class MatchLinkDto {
  productId: number;
  productSupplierId: number;

  public constructor(init?: Partial<MatchLinkDto>) {
    Object.assign(this, init);
  }
}
