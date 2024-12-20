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
  wholeSalePrice: number;
  shopSaleQty: number;
  retailPrice: number;
}
export interface IAccumulativeSalePurchaseReportData {
  productId: number;
  article: string;
  image: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
export interface IDailySaleReportData {
  article: string;
  image: string;
  retailPrice: number;
  quantity: number;
  discount: number;
  netAmount: number;
  commission: number;
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
export interface IBestSellingArticle {
  name: string;
  monthId: number;
}
export interface IOutStandingReportData {
  user: string;
  balance: number | null;
  phone: string | number | null;
}
export interface IProfitLossReportData {
  netSale: number | null;
  totalWholeSalePrice: number | null;
  profitByWholeSalePrice: number | null;
  totalCostPrice: number | null;
  profitByCostPrice: number | null;
  totalExpense: number | null;
  expnseDetails: IProfitLossExpnseDetails[];
}
export interface IProfitLossExpnseDetails {
  expense: string;
  amount: number;
}
export interface ICashClosinReport {
  shop: string;
  netSale: number;
  totalExpense: number;
  remainingBalance: number;
  date: string;
  outgoingToHO: number;
}
export interface IComissionReport {
  shop: string;
  pairSale: number;
  comission: number;
  total: number;
  date: string;
  productId: number;
  comissionDetails: IComissionDetail[];
}
export interface IArticleHistoryReport {
  stock: number | null;
  retailPrice: number | null;
  purchaseInfo: IPurchaseInfo[];
  wholeSaleInfo: IWholeSaleInfo[];
  grnInfo: IGrnInfo[];
  strInfo: IStrInfo[];
}
export interface IPurchaseInfo {
  user: string;
  quantity: number;
}
export interface IWholeSaleInfo {
  user: string;
  quantity: number;
}
export interface IGrnInfo {
  date: string;
  quantity: number;
}
export interface IStrInfo {
  fromShop: string;
  toShop: string;
  quantity: number;
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
export interface IArticleSaleDistributionByColorDetail {
  article: string;
  retailPrice: number;
  masterStock: number;
  grandSaleQuantity: number;
  articleSaleByShop: IArticleSaleByShop[];
  image: string;
}

export interface IArticleSaleByShop {
  shop: string;
  totalSaleQuantity: number;
  articleByColor: IArticleByColor[];
}

export interface IArticleByColor {
  variant2_Id: number;
  variant2_Name: string;
  quantity: number;
}
export interface IHOStockReportData {
  productName: string;
  productImage: string | null;
  masterStock: number | null;
  retailPrice: number;
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
export interface IOfflineShopArticleReportData {
  article: string;
  image: string;
  retailPrice: number;
  totalStock: number;
  comission: number;
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
export interface IShopwiseStockTransferReportData {
  article: string;
  image: string | null;
  productId: number;
  retailPrice: number;
  totalStock: number;
  totalSale: number;
  shopDetail: IShopDetail[];
  wholeSalePrice: number;
}

export interface ICashClosingData {
  date: Date;
  productId: number;
  shop: string;
  netSale: number;
  outgoingToHO: number;
  remainingBalance: number;
  totalExpense: number;
  // shopDetail: IShopDetail[];
}
export interface IShopDetail {
  shop: string;
  stock: number;
  saleQuantity: number;
}

export interface IComissionReport {
  date: string;
  totalPairs: number;
  totalValue: number;
  comissionDetails: IComissionDetail[];
}
export interface IComissionDetail {
  pairSale: number;
  comission: number;
  total: number;
}
export interface IShelfArticleSaleReportData {
  article: string;
  image: string | null;
  productId: number;
  retailPrice: number;
  totalStock: number;
  totalSale: number;
}
export interface IBestSellingArticleReportData {
  year: number;
  details: IProductDetails[];
}

export interface IProductDetails {
  productId: number;
  article: string;
  image: string;
  saleQty: number;
}
export interface INewArticleSaleAndStockReportData {
  image: string;
  article: string;
  retailPrice: number;
  totalStock: number;
  totalSale: number;
  colorDetails: IColorDetail[];
}

export interface IColorDetail {
  variant2_Name: string;
  variantId_2: number;
  saleQuantity: number;
  stockQuantity: number;
}
export interface ICurrentClosingReportData {
  shop: string;
  discount: number;
  netSale: number;
  remainingBalance: number;
  totalItemsSale: number;
}
