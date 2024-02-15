export interface IAddShopSaleManagement {
  shopId: number | undefined;
  totalDiscount: number;
  salePersonCode: string | null;
  saleStatus: number;
  comments: string;
  saleDetails: ISaleDetail[];
  returnSaleDetails?: ISaleDetail[];
}

export interface ISaleDetail {
  inventoryId?: number;
  quantity: number;
  discount?: number;
}
export interface IBillStatusOptionList {
  name: string;
  statusId: number | null;
}
export interface ISaleFilterList {
  statusId: IBillStatusOptionList | null;
  shopId: number | null;
  invoiceNumber: string | null;
  fromDate: string | null;
  toDate: string | null;
}
export interface ISaleListResponse {
  invoiceNumber: string;
  shopName: string;
  salePersonCode: string;
  status: string;
  totalDiscount: number;
  totalQuantity: number;
  netAmount: number;
  comments: string;
  saleDate: string;
  shopId: number;
  saleId: number;
  totalSalesAmount: number;
}
export interface SaleSummaryResponse {
  shopId: number;
  shopAccountId: number;
  shopName: string;
  openingBalance: number;
  remainingBalance: number;
  shopAccountStatus: string;
  availableStock: number;
  totalItemsSale: number;
  totalDiscount: number;
  totalIncomingFromHO: number;
  totalOutgoingToHO: number;
  totalSale: number;
  totalExpense: number;
  totalReturnSaleAmount: number;
  lastClosingDate: string;
  createdDate: string;
  salesExpenseSummary: IShopSaleExpenses[];
}
export interface IShopSaleExpenses {
  expenseTypeId: number;
  expenseName: string;
  amount: number;
  comment: string | null;
  transactionDate: string;
}
