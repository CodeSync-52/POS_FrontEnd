export interface IShopResponse extends IShopBasicInfo {
  shopId: number;
  closingBalance: number;
  status: string;
  isWareHouse: string;
}
export interface IShopBasicInfo {
  name: string;
  phone: string;
  address: string;
  code: string;
}
export type IAddNewShopPayload = Omit<IShopBasicInfo, 'status'>;
