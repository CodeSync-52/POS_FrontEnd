import {
  IGenericResponse,
  IGrnListFilter,
  IGrnRecords,
  ISelectedPayload,
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
