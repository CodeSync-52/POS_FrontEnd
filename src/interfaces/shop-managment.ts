export interface IShopData {
  ShopId: number;
  userId: number;
  shopName: string;
  shopAddress: string;
  shopcode: number;
  closingBalance: string;
  createdBy: null | string;
  outStandingBalance: number;
  updatedDate: string;
  createdById: number;
  updatedBy: null;
}
export interface IUserShopResponse {
  shopName: string;
  shopAddress: string;
  shopPhoneNumber?: number;
  shopManagerName?: number;
}
