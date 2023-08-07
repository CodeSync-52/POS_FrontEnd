import { IGenericResponse, IUserData } from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const viewUserProfile = async () => {
  const res = await makeApiCall<
    IGenericResponse<{ fullName: string; phoneNumber: string }>
  >({
    method: 'GET',
    url: 'api/Account/user/profile',
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
    url: 'api/Account/user/profile/update',
    data: payload,
  });
  return res;
};

export const getUserListApi = async ({
  pageNumber = 1,
  pageSize = 50,
}: {
  pageNumber?: number;
  pageSize?: number;
}) => {
  const res = await makeApiCall<
    IGenericResponse<{
      totalItemCount: number;
      items: IUserData[];
    }>
  >({
    url: `api/User/list?PageNumber=${pageNumber}&PageSize=${pageSize}`,
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
  const res = await makeApiCall<IGenericResponse>({
    method: 'PUT',
    url: `api/User/change/status?userId=${customerId}`,
  });
  return res;
};
