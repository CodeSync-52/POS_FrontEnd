import {
  IGenericResponse,
  IGrnListFilter,
  IGrnRecord,
  ISelectedGRNRecord,
  IGrnPreviewResponse,
} from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const CreateGRN = async (payload: ISelectedGRNRecord) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/grn/add',
    method: 'POST',
    data: {
      ...payload,
    },
  });
  return res;
};

export const GetGRNDetail = async (grnId: number) => {
  const res = await makeApiCall<IGenericResponse<IGrnPreviewResponse>>({
    url: 'api/grn/detail',
    method: 'GET',
    params: {
      grnId,
    },
  });
  return res;
};
export const GetGRNList = async (
  {
    PageNumber = 1,
    PageSize = 50,
    status,
    filterSearch,
  }: {
    PageNumber: number;
    PageSize: number;
    status: number;
    filterSearch: IGrnListFilter;
  },
  controller?: AbortController
) => {
  const res = await makeApiCall<
    IGenericResponse<{ items: IGrnRecord[]; totalItemCount: number }>
  >({
    url: 'api/grn/list',
    method: 'GET',
    params: {
      PageNumber,
      PageSize,
      status,
      ...filterSearch,
    },
    signal: controller?.signal,
  });
  return res;
};

export const UpdateGRN = async (payload: any) => {
  const res = await makeApiCall<any>({
    url: `api/grn/update?grnDetailId=${payload.grnId}&quantity=${payload.quantity}`,
    method: 'PUT',
  });
  return res;
};
