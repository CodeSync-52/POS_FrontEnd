import {
  IGenericResponse,
  ISalesFilterSearch,
  ISalesManagementData,
} from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const salesManagementListApi = async (
  {
    filterSearch,
    PageNumber,
    PageSize,
  }: {
    filterSearch: ISalesFilterSearch;
    PageNumber: number;
    PageSize: number;
  },
  controller?: AbortController
) => {
  const { startDate, userId, userName, wholesaleStatus, endDate } =
    filterSearch;
  const res = await makeApiCall<
    IGenericResponse<{ items: ISalesManagementData[]; totalItemCount: number }>
  >({
    method: 'GET',
    url: '',
    params: {
      PageNumber,
      PageSize,
      FromDate: startDate,
      UserId: userId,
      FullName: userName,
      wholesaleStatus,
      ToDate: endDate,
    },
    signal: controller?.signal,
  });
  return res;
};
