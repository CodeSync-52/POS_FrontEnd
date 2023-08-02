import { apiResponse } from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const getUserApi = async ({
  pageNumber,
  pageSize,
}: {
  pageNumber: number;
  pageSize: number;
}) => {
  try {
    const response: apiResponse = await makeApiCall({
      url: `api/User/list?PageNumber=${pageNumber}&PageSize=${pageSize}`,
      method: 'GET',
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

export const createUserApi = async ({
  payload,
}: {
  payload: {
    fullName: string;
    phoneNumber: string;
    flatDiscount?: number;
    userName: string;
    userRoleName: string | number | undefined;
  };
}) => {
  try {
    const response = await makeApiCall({
      url: 'api/User/create',
      method: 'POST',
      data: payload,
    });

    return response;
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};
