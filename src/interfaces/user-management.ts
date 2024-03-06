import { EUserRoles } from './general';

interface IUserCustomer {
  roleName: EUserRoles.Customer;
  flatDiscount: number;
  customerGroupId: number | null;
  status: string;
}

interface IUserNonCustomer {
  roleName: Exclude<EUserRoles, EUserRoles.Customer>;
  flatDiscount?: number | undefined;
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
  status: string;
  discount: number;
  address: string;
  customerGroup: null | string;
} & IUserManagementData;
export interface IUserResponse {
  customerGroup?: null | string;
  customerGroupId?: null | number;
  discount?: number;
  fullName: string | null;
  flatDiscount?: number;
  outStandingBalance?: number;
  phoneNumber: string;
  roleName: string;
  status?: string;
  shopName?: string;
  userId?: number;
  userName: string;
  address: string;
  shopId?: null | number;
}
export interface IUserFilterList {
  customerGroupId: number | null;
  role: string | null;
  status: string | null;
}
export type IUserPayload = Omit<IUserResponse, 'status'>;
