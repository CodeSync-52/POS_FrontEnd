import {
  IGenericResponse,
  ISalesFilterSearch,
  ISalesManagementData,
  ISelectedArticleList,
  IWholeSalesDetailInfo,
} from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const addWholeSaleApi = async ({
  userId,
  claim,
  freight,
  productList,
  comments,
}: {
  userId: number | null;
  claim: number | undefined;
  freight: number | undefined;
  productList: ISelectedArticleList[] | null;
  comments: string | null;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/wholesale/add',
    method: 'POST',
    data: {
      userId,
      claim,
      freight,
      productList,
      comments,
    },
  });
  return res;
};
export const salesManagementListApi = async (
  {
    filterSearch,
    PageNumber = 1,
    PageSize = 50,
  }: {
    filterSearch: ISalesFilterSearch;
    PageNumber: number;
    PageSize: number;
  },
  controller?: AbortController
) => {
  const {
    startDate,
    userId,
    userName,
    wholeSaleStatus,
    endDate,
    customerGroupId,
  } = filterSearch;
  const res = await makeApiCall<
    IGenericResponse<{ items: ISalesManagementData[]; totalItemCount: number }>
  >({
    method: 'GET',
    url: 'api/wholesale/list',
    params: {
      PageNumber,
      PageSize,
      FromDate: startDate,
      UserId: userId,
      FullName: userName?.trim(),
      wholeSaleStatus,
      ToDate: endDate,
      CustomerGroupId: customerGroupId,
    },
    signal: controller?.signal,
  });
  return res;
};
export const wholeSaleDetailApi = async (wholeSaleId: number) => {
  const res = await makeApiCall<IGenericResponse<IWholeSalesDetailInfo>>({
    url: 'api/wholesale/detail',
    method: 'GET',
    params: {
      wholeSaleId,
    },
  });
  return res;
};
export const completeWholeSaleApi = async (wholeSaleId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: 'api/wholesale/complete',
    params: {
      wholeSaleId,
    },
  });
  return res;
};
export const deleteWholeSaleDetailApi = async (wholeSaleDetailId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/wholesale/detail/delete',
    method: 'PUT',
    params: {
      wholeSaleDetailId,
    },
  });
  return res;
};
export const updateWholeSaleDetailApi = async ({
  wholeSaleDetailId,
  quantity,
  unitWholeSalePrice,
}: {
  wholeSaleDetailId: number;
  unitWholeSalePrice: number;
  quantity: number;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/wholesale/detail/update',
    method: 'PUT',
    params: {
      wholeSaleDetailId,
      quantity,
      unitWholeSalePrice,
    },
  });
  return res;
};
export const addWholeSaleDetailApi = async ({
  wholeSaleId,
  productId,
  quantity,
}: {
  wholeSaleId: number;
  productId: number;
  quantity: number;
}) => {
  const res = await makeApiCall<IGenericResponse<number>>({
    url: 'api/wholesale/detail/add',
    method: 'PUT',
    params: {
      wholeSaleId,
      productId,
      quantity,
    },
  });
  return res;
};
export const cancelWholeSaleApi = async (wholeSaleId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/wholesale/cancel',
    method: 'PUT',
    params: {
      wholeSaleId,
    },
  });
  return res;
};
export const ClaimFreightApi = async ({
  wholeSaleId,
  claim,
  freight,
}: {
  wholeSaleId: number;
  claim: number | undefined;
  freight: number | undefined;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: 'api/wholesale/claimfreight',
    params: {
      wholeSaleId,
      claim,
      freight,
    },
  });
  return res;
};
