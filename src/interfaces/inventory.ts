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
  ProductId: number | null;
  ShopId: number | null;
}
export interface IInventoryListResponse {
  productId: number;
  productName: string;
  productImage: string;
  productLabel: string;
  variantId_1: number;
  variantId_2: number;
  quantity: number;
  addedDate: string;
}
