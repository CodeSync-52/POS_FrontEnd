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
  userId: number;
  wholeSaleDetails: IWholeSaleDetailsData[];
  wholeSaleStatus: string;
}
export interface IWholeSaleDetailsData {
  productId: number;
  quantity: number;
  totalAmount: number;
  unitWholeSalePrice: number;
  wholeSaleDetailId: number;
}
