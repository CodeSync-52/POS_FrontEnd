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
  inComingFromHO?: [];
  outgoingToHO?: [];
  salesExpenseSummary?: [];
}
