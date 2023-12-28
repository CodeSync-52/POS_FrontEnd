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
  productId: number;
  productCode: string;
  amount: number;
  quantity: number;
  discount: number;
}
