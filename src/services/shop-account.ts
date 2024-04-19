import { IGenericResponse } from 'src/interfaces';
import { makeApiCall } from 'src/utils';
export const GetShopAccountReport = async ({
  shopIds,
  fromDate,
  toDate,
  pageNumber,
  pageSize,
}: {
  shopIds: number[];
  fromDate: string;
  toDate: string;
  pageNumber: number;
  pageSize: number;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'POST',
    url: 'api/shopaccount/shopaccountreport',
    data: {
      shopIds,
      fromDate,
      toDate,
      pageNumber,
      pageSize,
    },
  });
  return res;
};
export const GetShopAccount = async (shopAccountId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/shopaccount/shopaccount',
    method: 'GET',
    params: {
      shopAccountId,
    },
  });
  return res;
};
