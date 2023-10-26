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
  ProductCode: string | null;
}
export interface IInventoryListResponse {
  addedDate: string;
  productId: number;
  productName: string;
  productImage: string;
  inventoryId: number;
  productCode: string;
  variantId_1: number;
  variantId_2: number;
  quantity: number;
}
export interface IInventoryListResponseWithDispatchQuantity
  extends IInventoryListResponse {
  dispatchQuantity: number;
}
