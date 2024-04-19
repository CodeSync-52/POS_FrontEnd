import { IProductIdWithQuantity } from './receipt-management';

export interface IWholeSalesData {
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
export interface IWholeSalesFilter {
  userId: null | number;
  userName: null | string;
  startDate: null | string;
  endDate: null | string;
  wholeSaleStatus: null | string;
  customerGroupId: null | number;
}
export interface IWholeSalesDetailInfo {
  createdBy: string;
  createdById: number;
  createdDate: string;
  discount: number;
  fullName: string;
  netAmount: number;
  claim?: number;
  freight?: number;
  outStandingBalance: number;
  totalAmount: number;
  totalQuantity: number;
  updatedBy: null | number;
  updatedDate: string;
  userId: number | null;
  wholeSaleDetails: IWholeSaleProductsInfo[];
  wholeSaleStatus: string;
  comments: string | null;
}

export interface IWholeSaleProductsInfo extends IProductIdWithQuantity {
  totalAmount: number;
  unitWholeSalePrice: number;
  wholeSaleDetailId: number;
  productName?: string;
  productImage: string | null;
  masterStock?: number;
}
export interface IAddNewWholeSale {
  userId: number | null;
  userDiscount: number;
  userOutstandingBalance: number;
  productList: IProductIdWithQuantity[];
  comments: string | null;
}

export interface ISelectedWholeSaleArticleData {
  productId: number | null;
  quantity?: number | null;
  productName?: string;
  wholeSaleDetailId?: number;
  productImage: string | null;
  unitWholeSalePrice?: number;
  totalAmount?: number;
  masterStock?: number;
  retailPrice?: number;
  errorMessage?: string;
}
