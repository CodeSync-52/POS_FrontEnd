export interface ISelectedInventoryPayload {
  shopId: number;
  productWithVariantDTOs: IProductWithVariantDTOs[];
}
export interface IProductWithVariantDTOs {
  productId: number;
  variantStocks: IVariantStocks[];
}
export interface IVariantStocks {
  variantId_1: number;
  variantId_2: number;
  stockQuantity: number;
}
export interface IInventoryFilterSearch {
  FromDate: string | null;
  ToDate: string | null;
  ShopId: string | null;
}
export interface IInventoryListResponse {
  shopId: number;
  totalProducts: number;
  addedBy: string;
  createdBy: number;
  addedDate: string;
}
