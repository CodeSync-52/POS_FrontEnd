export interface IAccountReportData {
  date: Date;
  transactionDetail: string;
  debit: number | null;
  credit: number | null;
  balance: number;
}

export interface IOutStandingReportData {
  user: string;
  balance: number | null;
  phone: string | number | null;
}

export interface IShopSaleStockReportData {
  variant2_Id: number;
  variant2_Name: string;
  shop: string;
  totalSaleQuantity: number;
  list: IStockSaleByShopDetail[];
}

export interface IStockSaleByShopDetail {
  variant1_Id: number;
  variant1_Name: string;
  stockQuantity: number;
}

export interface IHOStockReportData {
  productName: string;
  productImage: string | null;
  masterStock: number | null;
}

export interface IShopStockReportData {
  article: string;
  image?: string | null;
  productId: number;
  variant2List: IVariant2Info[];
}

export interface IVariant2Info {
  variant2_Id: number;
  variant2_Name: string;
  totalQuantity: number;
  variant1List: IVariant1Info[];
}

export interface IVariant1Info {
  variant1_Id: number;
  variant1_Name: string;
  quantity: number;
}

export interface IHOArticleReportData {
  product: string;
  image: string | null;
  quantity: number | null;
  amount: number | null;
}

export interface IHOSaleDetailReportData {
  date: string;
  user: string;
  quantity: number | null;
  amount: number | null;
}
