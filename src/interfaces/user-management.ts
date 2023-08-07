import { EUserRoles } from './general';

interface IUserCustomer {
  roleName: EUserRoles.Customer;
  assignShop: number;
  flatDiscount: number;
  customerGroupId: number;
  isActive: boolean;
}

interface IUserNonCustomer {
  roleName: Exclude<EUserRoles, EUserRoles.Customer>;
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
  customerGroup: null | any;
} & ICreateUserPayload;
export interface IUserResponse {
  customerGroup: null;
  discount: null;
  fullName: string;
  phoneNumber: string;
  roleName: string;
  status: string;
  userId: number;
  username: string;
}
