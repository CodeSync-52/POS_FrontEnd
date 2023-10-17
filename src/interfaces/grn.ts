export interface ISelectedPayload {
  fromShopId: number | null;
  toShopId: number | null;
  grnDetails: IGrnDetails[];
}
export interface IGrnDetails {
  productId: number;
  variantId_1: number;
  variantId_2: number;
  quantity: number;
}
