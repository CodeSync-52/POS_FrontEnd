import { ICashFlowRecords, IGenericResponse } from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const GetCashFlowList = async (
  {
    filterSearch,
    PageNumber = 1,
    PageSize = 50,
    IsReverted,
  }: {
    filterSearch: { FromDate: string | null; ToDate: string | null };
    PageNumber: number;
    PageSize: number;
    IsReverted: boolean;
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
      IsReverted,
    },
    signal: controller?.signal,
  });
  return res;
};
export const CreateTransaction = async ({
  sourceUserId,
  amount,
  targetUserId,
  comments,
  cashFlowId,
}: {
  sourceUserId: number;
  amount: number;
  targetUserId: number;
  comments?: string;
  cashFlowId: number | null;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'POST',
    url: 'api/cashflow/add',
    data: {
      sourceUserId,
      amount,
      targetUserId,
      comments,
      cashFlowId,
    },
  });
  return res;
};
export const cashReceiveFromHOApi = async ({
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
export const RetaurnCashToHO = async ({
  shopId,
  amount,
  transactionUserId,
  comment,
}: {
  shopId: number;
  amount: number;
  transactionUserId: number;
  comment: string;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'POST',
    url: 'api/shopaccount/cash/return/warehouse',
    data: {
      shopId,
      amount,
      transactionUserId,
      comment,
    },
  });
  return res;
};
