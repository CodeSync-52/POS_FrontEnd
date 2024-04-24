import {
  IGenericResponse,
  IWholeSalesFilter,
  IWholeSalesData,
  IProductIdWithQuantity,
  IWholeSalesDetailInfo,
} from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const CreateWholeSale = async ({
  userId,
  claim,
  freight,
  productList,
  comments,
}: {
  userId: number | null;
  claim: number | undefined;
  freight: number | undefined;
  productList: IProductIdWithQuantity[] | null;
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
export const GetWholeSaleList = async (
  {
    filterSearch,
    PageNumber = 1,
    PageSize = 50,
  }: {
    filterSearch: IWholeSalesFilter;
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
    IGenericResponse<{ items: IWholeSalesData[]; totalItemCount: number }>
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
export const GetWholeSaleDetail = async (wholeSaleId: number) => {
  const res = await makeApiCall<IGenericResponse<IWholeSalesDetailInfo>>({
    url: 'api/wholesale/detail',
    method: 'GET',
    params: {
      wholeSaleId,
    },
  });
  return res;
};
export const CompleteWholeSale = async (wholeSaleId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: 'api/wholesale/complete',
    params: {
      wholeSaleId,
    },
  });
  return res;
};
export const DeleteWholeSaleLineItem = async (wholeSaleDetailId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/wholesale/detail/delete',
    method: 'PUT',
    params: {
      wholeSaleDetailId,
    },
  });
  return res;
};
export const UpdateWholeSaleLineItem = async ({
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
export const updateSaleManagementCommentApi = async ({
  wholeSaleId,
  comments,
}: {
  wholeSaleId: number;
  comments: string;
}) => {
  return makeApiCall<IGenericResponse<null>>({
    url: 'api/wholesale/update',
    method: 'PUT',
    params: {
      wholeSaleId,
      comments,
    },
  });
};
export const CreateWholeSaleLineItem = async ({
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
export const CancelWholeSale = async (wholeSaleId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/wholesale/cancel',
    method: 'PUT',
    params: {
      wholeSaleId,
    },
  });
  return res;
};
export const UpdateWholeSaleClaimFreight = async ({
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
