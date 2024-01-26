export interface IShopSaleExpenses {
  id: number;
  name: string;
  amount: number;
  isSavingRow: boolean;
  isEditing: boolean;
}
export interface IAddShopSaleManagement {
  shopId: number | undefined;
  totalDiscount: number;
  salePersonCode: string | null;
  saleStatus: number;
  comments: string;
  saleDetails: ISaleDetail[];
}

export interface ISaleDetail {
  inventoryId?: number;
  quantity: number;
  discount: number;
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
