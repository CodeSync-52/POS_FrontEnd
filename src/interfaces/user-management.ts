import { IOption } from './general';

export interface IUserData {
  fullName: string;
  userName: string;
  phone: string;
  role?: IOption; // roleId, enum of role
  assignShop?: IOption; //number, api
  outStandingBalance?: number; // do not post
  wholeSaleDiscount?: number; //discountAmount
  isActive: boolean;
  password?: string;
  customerGroup?: IOption; // number , customerGroupID, api neened
  isPhnNumberAsUserNumber?: boolean; // do not post
  action?: any;
}
