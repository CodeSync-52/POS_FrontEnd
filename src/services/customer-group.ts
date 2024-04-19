import { ICustomerListResponse, IGenericResponse } from 'src/interfaces';
import { makeApiCall } from 'src/utils';
export const GetCustomerGroupList = async ({ status }: { status: string }) => {
  const res = await makeApiCall<
    IGenericResponse<{
      items: ICustomerListResponse[];
    }>
  >({
    method: 'GET',
    url: `api/CustomerGroup/list?status=${status}`,
  });
  return res;
};
export const ChangeCustomerGroupStatus = async (customerId: number) => {
  const res = await makeApiCall<IGenericResponse>({
    method: 'PUT',
    url: `api/CustomerGroup/changestatus?customerGroupID=${customerId}`,
  });
  return res;
};
export const CreateCustomerGroup = async (newCustomer: string) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'POST',
    url: 'api/CustomerGroup/create',
    data: { name: newCustomer },
  });
  return res;
};
export const UpdateCustomerGroup = async ({
  customerId,
  newName,
}: {
  customerId: number;
  newName: string;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: `api/CustomerGroup/update?customerGroupId=${customerId}`,
    data: { name: newName },
  });
  return res;
};
