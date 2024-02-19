export interface IShopAccountReport {
  shopAccountId: number;
  shopId: number;
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
  inComingFromHO?: InComingOutgoingToHo[];
  outgoingToHO?: InComingOutgoingToHo[];
  salesExpenseSummary?: IShopExpenses[];
}
export interface IShopExpenses {
  expenseTypeId: number;
  expenseName: string;
  amount: number;
  comment: string | null;
  transactionDate: string;
}
export interface InComingOutgoingToHo {
  userId: number;
  userName: string;
  amount: number;
  comment: string;
  transactionDate: string;
}
