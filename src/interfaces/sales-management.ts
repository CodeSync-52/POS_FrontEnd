export interface ISalesManagementData {
  wholeSaleId: number;
  userId: number;
  fullName: string;
  totalQuantity: number;
  discount: number;
  totalAmount: number;
  netAmount: number;
  wholeSaleStatus: string;
  createdDate: string;
}
export interface ISalesFilterSearch {
  userId: null | number;
  userName: null | string;
  startDate: null | string;
  endDate: null | string;
  wholeSaleStatus: null | string;
}
export interface ISelectedSalesDetailData {
  createdBy: string;
  createdById: number;
  createdDate: string;
  discount: number;
  fullName: string;
  netAmount: number;
  outStandingBalance: number;
  totalAmount: number;
  totalQuantity: number;
  updatedBy: null | number;
  updatedDate: string;
  userId: number | null;
  wholeSaleDetails: IWholeSaleDetailsData[];
  wholeSaleStatus: string;
}
export interface IWholeSaleDetailsData {
  productId: number;
  quantity: number;
  totalAmount: number;
  unitWholeSalePrice: number;
  wholeSaleDetailId: number;
  productName?: string;
  productImage: string | null;
}
export interface IWholesaleProductList {
  productId: number;
  quantity: number;
}
export interface IAddNewSale {
  userId: number | null;
  userDiscount: number;
  userOutstandingBalance: number;
  productList: ISelectedArticleList[];
}
export interface ISelectedArticleList {
  productId: null | number;
  quantity: null | number;
}
export interface ISelectedWholeSaleArticleData {
  productId: number | null;
  quantity?: number | null;
  productName?: string;
  wholeSaleDetailId?: number;
  productImage: string | null;
  unitWholeSalePrice?: number;
  totalAmount?: number;
}
