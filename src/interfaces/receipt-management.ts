export interface IReceiptData {
  purchaseId: number;
  userId: number;
  fullName: string;
  totalQuantity: number;
  purchaseStatus: string;
  createdDate: string;
  createdBy: null;
  outStandingBalance: number;
  updatedDate: string;
  createdById: number;
  updatedBy: null;
  purchaseDetails: IPurchaseDetails[];
}
export interface IPurchaseDetails {
  productId: number;
  productName: string;
  purchaseDetailId: number;
  productImage: string;
  quantity: number;
}
export interface ISelectedArticleData {
  productId: number | null;
  quantity?: number | null;
  productName?: string;
  purchaseDetailId?: number;
}

export interface IProductList {
  productId: null | number;
  quantity: null | number;
}
export interface IAddNewReceipt {
  userId: number | null;
  userOutstandingBalance: number;
  userDiscount: number;
  productList: IProductList[];
}
