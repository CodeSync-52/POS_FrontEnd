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
    url: 'api/grn/add',
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
  const res = await makeApiCall<
    IGenericResponse<{ items: IGrnRecords[]; totalItemCount: number }>
  >({
    url: 'api/grn/list',
    method: 'GET',
    params: {
      PageNumber,
      PageSize,
      ...filterSearch,
    },
    signal: controller?.signal,
  });
  return res;
};

export const updateGrnDetail = async (payload: any) => {
  const res = await makeApiCall<any>({
    url: `api/grn/update?grnDetailId=${payload.grnId}&quantity=${payload.quantity}`,
    method: 'PUT',
  });
  return res;
};
