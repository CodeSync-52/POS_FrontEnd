export interface IReceiptData {
  purchaseId: number;
  userId: number;
  fullName: string;
  totalQuantity: number;
  purchaseStatus: string;
  createdDate: string;
  createdBy: null | string;
  outStandingBalance: number;
  updatedDate: string;
  createdById: number;
  comments?: string;
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
  productImage: string;
  productName?: string;
  purchaseDetailId?: number;
  masterStock?: number;
  retailPrice?: number;
  comments?: string;
}
export interface IProductIdWithQuantity {
  productId: null | number;
  quantity: number;
}
export interface IAddNewReceipt {
  userId: number | null;
  userOutstandingBalance: number;
  userDiscount: number;
  createdDate: string;
  productList: IProductIdWithQuantity[];
  userName: string;
  purchaseStatus: string;
  comments: string;
}
