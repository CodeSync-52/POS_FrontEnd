import { _ } from 'app/dist/spa/assets/index.0d194373';

export interface IReceiptData {
  purchaseId: number;
  userId: number;
  fullName: string;
  totalQuantity: number;
  purchaseStatus: string;
  createdDate: string;
  createdBy: null;
  updatedDate: string;
  updatedBy: null;
  action?: string;
}
export interface ISelectedArticleData {
  productId: number | null;
  quantity?: number | null;
  name?: string;
  action?: string;
}

export interface IProductList {
  productId: null | number;
  quantity: null | number;
}
export interface IAddNewReceipt {
  userId: number | null;
  productList: IProductList[];
}
