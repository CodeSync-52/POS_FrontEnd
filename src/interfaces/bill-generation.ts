export interface IBillGenerationData {
  billId: number;
  userId: number;
  purchaseId: number;
  name: string;
  totalAmount: number;
  billStatus: string;
  createdDate: string;
  stockReceiveDate: string;
  createdBy: null | number | string;
}

export interface IBillData {
  billId: number;
  billStatus: string;
  createdDate: string;
  stockReceivingDate: string;
  outStandingBalance: number;
  fullName: string;
  productList: IBillProductList[];
  totalAmount: number;
  claim: number;
  freight: number;
  comments: string;
}
export interface IBillFilter {
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
  comments: string | null;
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
  productList: IProductGenericList[];
}
export interface IProductIdWithAmount {
  productId: number;
  amount: number;
}
export interface IProductGenericList extends IProductIdWithAmount {
  name: string;
  image: string;
}
export interface IBillProductList extends IProductGenericList {
  quantity: number;
}
