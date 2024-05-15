export interface IAccountReportData {
  date: Date;
  transactionDetail: string;
  debit: number | null;
  credit: number | null;
  comments: string | null;
  balance: number;
}
export interface IDateWiseShopReportData {
  transactionDate: string;
  shop: string;
  totalAmount: number;
  quantity: number;
  discount: number;
  netAmount: number;
}
export interface IVendorSaleStockReportData {
  productId: number;
  article: string;
  image: string;
  lastPurchasePrice: number;
  hoStock: number;
  shopStock: number;
  hoSaleQty: number;
  shopSaleQty: number;
}
export interface IDailySaleReportData {
  article: string;
  image: string;
  retailPrice: number;
  quantity: number;
  discount: number;
  netAmount: number;
}
export interface ISlowArticleSaleReportData {
  article: string;
  image: string;
  productId: number;
  retailPrice: number;
  salePercentage: number;
  saleQuantity: number;
  totalStock: number;
}
export interface IShowOnlyDiscount {
  name: string;
  statusId: number;
}
export interface IOutStandingReportData {
  user: string;
  balance: number | null;
  phone: string | number | null;
}

export interface IShopSaleStockReportData {
  variant2_Id: number;
  variant2_Name: string;
  totalStockQuantity: number;
  totalSaleQuantity: number;
  shopQty: IShopQuantity[];
}

export interface IShopQuantity {
  shop: string;
  totalSaleQuantity: number;
  totalStockQuantity: number;
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
  imageDataUrl?: string | null;
  productId: number;
  retailPrice: number;
  grandTotal: number;
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
