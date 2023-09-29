export interface IShopResponse {
  items: IShopData[];
  totalItemCount: number;
}

export interface IShopData {
  shopId: number;
  closingBalance: number;
  status: string;
  isWareHouse: string;
  name: string;
  phone: string;
  address: string;
  code: string;
}
export interface IShopAddNew {
  name: string;
  phone: string;
  address: string;
  code: string;
}
export type IAddNewShopPayload = Omit<IShopAddNew, 'status'>;
