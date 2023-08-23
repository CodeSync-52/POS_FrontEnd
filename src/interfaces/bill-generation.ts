export interface IBillGenerationData {
  billId: number;
  userId: number;
  name: string;
  totalAmount: number;
  date: string;
  recordStatus: string;
  action?: string;
  productReceipt: IProductReceipt[];
}
export interface IProductReceipt {
  image: string;
  name: string;
  quantity: number;
  amount: number;
  netTotal?: number;
}
export interface IBillGenerationFilter {
  billId: null | number;
  userName: null | string;
  ToDate: null | string;
  FromDate: null | string;
}
