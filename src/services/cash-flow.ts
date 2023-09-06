import { ICashFlowRecords, IGenericResponse } from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const cashFlowListApi = async (
  {
    filterSearch,
    PageNumber = 1,
    PageSize = 50,
  }: {
    filterSearch: { FromDate: string | null; ToDate: string | null };
    PageNumber: number;
    PageSize: number;
  },
  controller?: AbortController
) => {
  const { FromDate, ToDate } = filterSearch;
  const res = await makeApiCall<
    IGenericResponse<{ items: ICashFlowRecords[]; totalItemCount: number }>
  >({
    method: 'GET',
    url: 'api/cashflow/list',
    params: {
      PageNumber,
      PageSize,
      FromDate,
      ToDate,
    },
    signal: controller?.signal,
  });
  return res;
};
export const addCashFlowApi = async ({
  sourceUserId,
  amount,
  targetUserId,
}: {
  sourceUserId: number;
  amount: number;
  targetUserId: number;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'POST',
    url: 'api/cashflow/add',
    data: {
      sourceUserId,
      amount,
      targetUserId,
    },
  });
  return res;
};
