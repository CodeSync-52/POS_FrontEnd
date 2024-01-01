export interface IShopSaleExpenses {
  id: number;
  name: string;
  amount: number;
  isSavingRow: boolean;
  isEditing: boolean;
}
export interface IAddShopSaleManagement {
  salePersonCode: string | null;
  shopId: number | undefined;
  totalDiscount: number;
  saleStatus: number;
  comments: string;
  saleDetails: ISaleDetail[];
}

export interface ISaleDetail {
  inventoryId: number;
  saleId: number;
  quantity: number;
  discount: number;
}
