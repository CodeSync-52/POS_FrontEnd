import { ICustomerListResponse, IGenericResponse } from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const getCustomerGroupList = async ({
  pageNumber = 1,
  pageSize = 50,
}: {
  pageNumber?: number;
  pageSize?: number;
}) => {
  const res = await makeApiCall<
    IGenericResponse<{
      totalItemCount: number;
      items: ICustomerListResponse[];
    }>
  >({
    method: 'GET',
    url: `api/CustomerGroup/customergroup/list?pageNumber=${pageNumber}&pageSize=${pageSize}`,
  });
  return res;
};
export const changeCustomerStatus = async (customerId: number) => {
  const res = await makeApiCall<IGenericResponse>({
    method: 'PUT',
    url: `api/CustomerGroup/changestatus?customerGroupID=${customerId}`,
  });
  return res;
};
export const addNewCustomerGroup = async (newCustomer: string) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'POST',
    url: 'api/CustomerGroup/create',
    data: { name: newCustomer },
  });
  return res;
};
export const updateCustomerGroup = async ({
  customerId,
  status,
  newName,
}: {
  customerId: number;
  status: number;
  newName: string;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: `api/CustomerGroup/update?customerGroupId=${customerId}`,
    data: { name: newName, status: status },
  });
  return res;
};
