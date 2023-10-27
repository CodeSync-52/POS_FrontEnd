import {
  IGenericResponse,
  IGrnListFilter,
  IGrnRecords,
  ISelectedPayload,
  IGrnPreviewResponse,
} from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const addGrnApi = async (payload: ISelectedPayload) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/grn/add/inventory',
    method: 'POST',
    data: {
      ...payload,
    },
  });
  return res;
};

export const viewGrnApi = async (grnId: number) => {
  const res = await makeApiCall<IGenericResponse<IGrnPreviewResponse>>({
    url: 'api/grn/detail',
    method: 'GET',
    params: {
      grnId,
    },
  });
  return res;
};
export const grnListApi = async (
  {
    PageNumber = 1,
    PageSize = 50,
    filterSearch,
  }: {
    PageNumber: number;
    PageSize: number;
    filterSearch: IGrnListFilter;
  },
  controller?: AbortController
) => {
  const { FromShop, ToShop, FromDate, ToDate } = filterSearch;
  const res = await makeApiCall<
    IGenericResponse<{ items: IGrnRecords[]; totalItemCount: number }>
  >({
    url: 'api/grn/list',
    method: 'GET',
    params: {
      PageNumber,
      PageSize,
      FromShopId: FromShop,
      ToShopId: ToShop,
      ToDate,
      FromDate,
    },
    signal: controller?.signal,
  });
  return res;
};
