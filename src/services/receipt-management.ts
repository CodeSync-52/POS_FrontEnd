import { IAddNewReceipt, IGenericResponse, IReceiptData } from 'src/interfaces';
import { makeApiCall } from 'src/utils';
export const receiptListApi = async ({
  ToDate,
  PageNumber = 1,
  PageSize = 50,
  FromDate,
  UserId,
  FullName,
}: {
  ToDate: string | null;
  FromDate: string | null;
  UserId: number | null;
  FullName: string | null;
  PageNumber: number;
  PageSize: number;
}) => {
  const res = await makeApiCall<
    IGenericResponse<{ items: IReceiptData[]; totalItemCount: number }>
  >({
    method: 'GET',
    url: 'api/Purchase/list',
    params: {
      UserId,
      ToDate,
      FromDate,
      FullName,
      PageNumber,
      PageSize,
    },
  });
  return res;
};
export const cancelReceiptApi = async (purchaseId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: 'api/Purchase/cancel',
    params: {
      purchaseId,
    },
  });
  return res;
};

export const createNewReceipt = async ({ data }: { data: IAddNewReceipt }) => {
  return makeApiCall({
    url: 'api/Purchase/add',
    method: 'POST',
    data,
  });
};

export const getReceiptData = async (purchaseId: string | number) => {
  return makeApiCall<IGenericResponse<IReceiptData>>({
    url: 'api/Purchase/detail',
    params: {
      purchaseId,
    },
  });
};

export const deleteReceiptRow = async (params: {
  purchaseId: number | string;
  purchaseDetailId: number | string;
}) => {
  return makeApiCall({
    url: 'api/Purchase/detail/delete',
    params,
    method: 'PUT',
  });
};

export const addReceiptRow = async (params: {
  purchaseId: number | string;
  productId: number;
  quantity: number;
}) => {
  return makeApiCall<IGenericResponse<number>>({
    url: 'api/Purchase/detail/add',
    method: 'PUT',
    params,
  });
};
export const editReceiptRow = async (params: {
  purchaseId: number | string;
  purchaseDetailId: number | string;
  quantity: number | string;
}) => {
  return makeApiCall<IGenericResponse<null>>({
    url: 'api/Purchase/detail/update',
    params,
    method: 'PUT',
  });
};
