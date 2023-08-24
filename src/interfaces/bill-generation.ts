export interface IBillGenerationData {
  billId: number;
  userId: number;
  name: string;
  totalAmount: number;
  date: string;
  recordStatus: string;
  action?: string;
}
export interface IBillGenerationFilter {
  billId: null | number;
  userName: null | string;
  ToDate: null | string;
  FromDate: null | string;
}
export interface IBillDetail {
  userId: number;
  fullName: string;
  outStandingBalance: null | number;
  productInfoDetailList: IProductInfoDetailList[];
  purchaseDate: string;
  totalPurchaseQuantity: number;
  quantity: number;
}
export interface IProductInfoDetailList {
  amount: number;
  image: string;
  productId: number;
  productName: string;
  purchaseDate: string;
  quantity: number;
}
