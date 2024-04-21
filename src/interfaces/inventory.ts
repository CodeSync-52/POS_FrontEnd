import { IShopResponse } from './shop-managment';

export interface ISelectedInventoryRecord {
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
export interface IInventoryFilterSearch extends IBaseInventoryFilterSearch {
  ShopId?: string | null;
}
export interface IBaseInventoryFilterSearch {
  ProductId: number | null;
  ProductCode: string | null;
  keyword: string | null;
  categoryName: string | null;
  CategoryId: number | null;
}
export interface IInventoryFilterSearchWithShopId
  extends IBaseInventoryFilterSearch {
  ShopId: IShopResponse[] | null;
}
export interface IInventoryListResponse {
  addedDate: string;
  productId: number;
  shopId: number;
  shopName: string;
  productName: string;
  productImage: string;
  inventoryId: number;
  productCode: string;
  variantId_1: number;
  variantId_2: number;
  retailPrice: number;
  quantity: number;
  saleDetailId?: number;
  size?: string;
  color?: string;
}
export interface IInventoryListResponseWithDispatchQuantity
  extends IInventoryListResponse {
  dispatchQuantity: number;
  errorMessage?: string;
}
export interface ISaleShopSelectedInventory
  extends IInventoryListResponseWithDispatchQuantity {
  discount: number;
  alreadyDispatchedQuantity?: number;
  isReturn?: boolean;
}
