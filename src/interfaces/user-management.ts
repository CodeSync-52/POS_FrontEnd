import { EUserRoles } from './general';

interface IUserCustomer {
  roleName: EUserRoles.Customer;

  flatDiscount: number;
  customerGroupId: number | null;
  status: string;
}

interface IUserNonCustomer {
  roleName: Exclude<EUserRoles, EUserRoles.Customer>;
  flatDiscount?: never;
  customerGroupId?: never;
  status?: 'InActive';
}
type ICreateUserPayloadCommon = {
  fullName: string;
  userName: string;
  phoneNumber: string;
  userId?: number;
};

export type IUserManagementData =
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
} & IUserManagementData;
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
export interface IUserFilterList {
  customerGroupId: number | null;
  role: string | null;
  status: string | null;
}
export type IUserPayload = Omit<IUserManagementData, 'status'>;
