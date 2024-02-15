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
  comments,
}: {
  sourceUserId: number;
  amount: number;
  targetUserId: number;
  comments?: string;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'POST',
    url: 'api/cashflow/add',
    data: {
      sourceUserId,
      amount,
      targetUserId,
      comments,
    },
  });
  return res;
};
export const addShopAccountApi = async ({
  shopId,
  amount,
  transactionUserId,
  shopAccountComment,
}: {
  shopId: number;
  amount: number;
  transactionUserId: number;
  shopAccountComment?: string;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'POST',
    url: 'api/shopaccount/cash/from/warehouse',
    data: {
      shopId,
      amount,
      transactionUserId,
      shopAccountComment,
    },
  });
  return res;
};
export const returnShopAccountApi = async ({
  shopId,
  amount,
  transactionUserId,
}: {
  shopId: number;
  amount: number;
  transactionUserId: number;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'POST',
    url: 'api/shopaccount/cash/return/warehouse',
    data: {
      shopId,
      amount,
      transactionUserId,
    },
  });
  return res;
};
