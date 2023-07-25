import { assignShop, customerGroup, role } from '../general';

export interface IuserManagementTableRow {
  fullName: string;
  userName: string;
  phone: string;
  role: role; // roleId, enum of role
  assignShop: assignShop; //number, api
  outStandingBalance?: number; // do not post
  wholeSaleDiscount?: number; //discountAmount
  isActive: boolean;
  password?: string;
  customerGroup: customerGroup; // number , customerGroupID, api neened
  isPhnNumberAsUserNumber?: boolean; // do not post
  action?: any;
}
