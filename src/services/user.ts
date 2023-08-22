import {
  IGenericResponse,
  IUserFilterList,
  IUserManagementData,
} from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const viewUserProfile = async () => {
  const res = await makeApiCall<
    IGenericResponse<{ fullName: string; phoneNumber: string }>
  >({
    method: 'GET',
    url: 'api/Account/profile',
  });
  return res;
};

export const editUserProfile = async ({
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
export const resetUserPassword = async (customerId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: `api/User/password/reset?userId=${customerId}`,
  });
  return res;
};
export const changeUserStatus = async (customerId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: `api/User/change/status?userId=${customerId}`,
  });
  return res;
};
export const updateUser = async ({
  userId,
  ...data
}: Partial<IUserManagementData>) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: `api/User/update?userId=${userId}`,
    data,
  });
  return res;
};

export const getUserListApi = async (
  {
    filterSearch,
    pageNumber = 1,
    pageSize = 50,
  }: {
    filterSearch?: IUserFilterList;
    name?: string | null;
    pageNumber?: number;
    pageSize?: number;
  },
  controller?: AbortController
) => {
  const res = await makeApiCall<
    IGenericResponse<{
      totalItemCount: number;
      items: IUserManagementData[];
    }>
  >({
    method: 'GET',
    url: 'api/User/list',
    params: {
      RoleName: filterSearch?.role,
      PageSize: pageSize,
      Status: filterSearch?.status,
      PageNumber: pageNumber,
      Name: name,
      CustomerGroupId: filterSearch?.customerGroupId,
    },
    signal: controller?.signal,
  });
  return res;
};
