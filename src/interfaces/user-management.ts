import { EUserRoles } from './general';

interface IUserCustomer {
  userRoleName: EUserRoles.Customer;
  assignShop: number;
  flatDiscount: number;
  customerGroupId: number;
  isActive: boolean;
}

interface IUserNonCustomer {
  userRoleName: Exclude<EUserRoles, EUserRoles.Customer>;
  assignShop: never;
  flatDiscount: never;
  customerGroupId: never;
  isActive: never;
}
type ICreateUserPayloadCommon = {
  fullName: string;
  userName: string;
  phoneNumber: string;
};

export type ICreateUserPayload =
  | (ICreateUserPayloadCommon & IUserCustomer)
  | (ICreateUserPayloadCommon & IUserNonCustomer);

export type IUserData = {
  outStandingBalance?: number; // do not post
  password?: string;
  isPhnNumberAsUserNumber?: boolean; // do not post
  action?: any;
  status: string;
  discount: number;
} & ICreateUserPayload;
