import {
  IGenericResponse,
  ISalesFilterSearch,
  ISalesManagementData,
  ISelectedSalesDetailData,
} from 'src/interfaces';
import { makeApiCall } from 'src/utils';

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
  const { startDate, userId, userName, wholeSaleStatus, endDate } =
    filterSearch;
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
      FullName: userName,
      wholeSaleStatus,
      ToDate: endDate,
    },
    signal: controller?.signal,
  });
  return res;
};
export const wholeSaleDetailApi = async (wholeSaleId: number) => {
  const res = await makeApiCall<IGenericResponse<ISelectedSalesDetailData>>({
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
