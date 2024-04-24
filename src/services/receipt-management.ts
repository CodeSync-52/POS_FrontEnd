import { IAddNewReceipt, IGenericResponse, IReceiptData } from 'src/interfaces';
import { makeApiCall } from 'src/utils';
export const GetPurchaseList = async (
  {
    customerGroupId,
    ToDate,
    PageNumber = 1,
    PageSize = 50,
    FromDate,
    UserId,
    FullName,
    PurchaseStatus,
  }: {
    customerGroupId: null | number;
    ToDate: string | null;
    FromDate: string | null;
    UserId: number | null;
    FullName: string | null;
    PageNumber: number;
    PageSize: number;
    PurchaseStatus: string | null;
  },
  controller?: AbortController
) => {
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
      PurchaseStatus,
      customerGroupId,
    },
    signal: controller?.signal,
  });
  return res;
};
export const CancelPurchase = async (purchaseId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: 'api/Purchase/cancel',
    params: {
      purchaseId,
    },
  });
  return res;
};

export const CreatePurchase = async ({ data }: { data: IAddNewReceipt }) => {
  return makeApiCall<IGenericResponse<null>>({
    url: 'api/Purchase/add',
    method: 'POST',
    data: {
      userId: data.userId,
      productList: [...data.productList],
      comments: data.comments,
    },
  });
};

export const GetPurchaseDetail = async (purchaseId: string | number) => {
  return makeApiCall<IGenericResponse<IReceiptData>>({
    url: 'api/Purchase/detail',
    params: {
      purchaseId,
    },
  });
};
export const updateReceiptCommentApi = async ({
  purchaseId,
  comments,
}: {
  purchaseId: number;
  comments: string;
}) => {
  return makeApiCall<IGenericResponse<null>>({
    url: 'api/purchase/update',
    method: 'PUT',
    params: {
      purchaseId,
      comments,
    },
  });
};

export const DeletePurchaseLineItem = async (params: {
  purchaseId: number | string;
  purchaseDetailId: number | string;
}) => {
  return makeApiCall({
    url: 'api/Purchase/detail/delete',
    params,
    method: 'PUT',
  });
};

export const CreatePurchaseLineItem = async (params: {
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
export const UpdatePurchaseLineItem = async (params: {
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
