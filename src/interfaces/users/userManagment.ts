export interface IuserManagementTableRow {
  userName: string;
  phone: string;
  role: string; // roleId, enum of role
  assignShop: string; //number, api
  outStandingBalance: number; // do not post
  wholeSaleDiscount: number; //discountAmount
  isActive: boolean;
  password: string;
  customerGroup: string; // number , customerGroupID, api neened
  isPhnNumberAsUserNumber: boolean; // do not post
  action?: any;
}
