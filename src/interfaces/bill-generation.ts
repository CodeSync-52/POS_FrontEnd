export interface IBillGenerationData {
  billId: number;
  userId: number;
  purchaseId: number;
  name: string;
  totalAmount: number;
  billStatus: string;
  createdDate: string;
  createdBy: null | number | string;
}
export interface IBillGenerationFilter {
  userId: null | number;
  userName: null | string;
  ToDate: null | string;
  FromDate: null | string;
  billStatus: null | string;
  CustomerGroupId: null | number;
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
  wholeSaleAmount: number;
}
export interface INewBillData {
  purchaseId: number;
  productList: INewBillProductList[];
}
export interface IUpdatedBillProductList {
  productId: number;
  amount: number;
}
export interface INewBillProductList {
  productId: number;
  amount: number;
  name: string;
  image: string;
}
export interface IBillGenerationDetailsInfoData {
  billId: number;
  billStatus: string;
  createdDate: string;
  outStandingBalance: number;
  fullName: string;
  productList: IBillGenerationDetailsInfoProductList[];
  totalAmount: number;
  claim: number;
  freight: number;
}
export interface IBillGenerationDetailsInfoProductList {
  amount: number;
  image: string;
  name: string;
  productId: number;
  quantity: number;
}
