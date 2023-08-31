export interface ISalesManagementData {
  wholesaleId: number;
  userId: number;
  fullName: string;
  totalQuantity: number;
  wholesaleStatus: string;
  totalAmount: number;
  discount: number;
}
export interface ISalesFilterSearch {
  userId: null | number;
  userName: null | string;
  startDate: null | string;
  endDate: null | string;
  wholesaleStatus: null | string;
}
