import {
  IGenericResponse,
  IUserFilterList,
  IUserPayload,
  IUserResponse,
} from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const GetUserProfile = async () => {
  const res = await makeApiCall<
    IGenericResponse<{ fullName: string; phoneNumber: string }>
  >({
    method: 'GET',
    url: 'api/Account/profile',
  });
  return res;
};

export const UpdateUserProfile = async ({
  payload,
}: {
  payload: {
    fullName: string;
    phoneNumber: string;
  };
}) => {
  const res = await makeApiCall<IGenericResponse>({
    method: 'POST',
    url: 'api/Account/profile',
    data: payload,
  });
  return res;
};
export const ResetUserPassword = async (customerId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: `api/User/password/reset?userId=${customerId}`,
  });
  return res;
};

export const ChangeUserRetailDisc = async (customerId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: `api/user/change/retaildiscount/eligibility?userId=${customerId}`,
  });
  return res;
};
export const ChangeUserStatus = async (customerId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: `api/User/change/status?userId=${customerId}`,
  });
  return res;
};
export const UpdateUser = async ({
  userId,
  ...data
}: Partial<IUserPayload>) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: `api/User/update?userId=${userId}`,
    data,
  });
  return res;
};

export const GetUsers = async (
  {
    filterSearch,
    pageNumber = 1,
    pageSize = 50,
  }: {
    filterSearch?: IUserFilterList;
    pageNumber?: number;
    pageSize?: number;
  },
  controller?: AbortController
) => {
  const res = await makeApiCall<
    IGenericResponse<{
      totalItemCount: number;
      items: IUserResponse[];
    }>
  >({
    method: 'GET',
    url: 'api/User/list',
    params: {
      RoleName: filterSearch?.role,
      PageSize: pageSize,
      Status: filterSearch?.status,
      PageNumber: pageNumber,
      Name: filterSearch?.name,
      CustomerGroupId: filterSearch?.customerGroupId,
    },
    signal: controller?.signal,
  });
  return res;
};
