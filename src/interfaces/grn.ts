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
export interface IGrnDetailsWithId {
  productId: number;
  variantId_1: number;
  variantId_2: number;
  quantity: number;
  inventoryId?: number;
  productName?: string;
  productImage?: string;
}
export interface IGrnListFilter {
  ToDate: string | null;
  FromDate: string | null;
  FromShop: null | number;
  ToShop: null | number;
}
export interface IGrnRecords {
  grnId: number;
  fromShopId: number;
  toShopId: number;
  fromShopName: string;
  toShopName: string;
  quantity: number;
  grnStatus: string;
  addedDate: string;
}
