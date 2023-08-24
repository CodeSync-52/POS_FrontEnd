import {
  IBillDetail,
  IBillGenerationData,
  IBillGenerationFilter,
  IGenericResponse,
} from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const billListApi = async ({
  PageNumber = 1,
  PageSize = 50,
  filterSearch,
}: {
  PageNumber: number;
  PageSize: number;
  filterSearch?: IBillGenerationFilter;
}) => {
  const res = await makeApiCall<
    IGenericResponse<{ items: IBillGenerationData[]; totalItemCount: number }>
  >({
    url: 'api/Bill/list',
    method: 'GET',
    params: {
      billId: filterSearch?.billId,
      FullName: filterSearch?.userName,
      FromDate: filterSearch?.FromDate,
      ToDate: filterSearch?.ToDate,
      PageNumber,
      PageSize,
    },
  });
  return res;
};
export const billDetailsApi = async (purchaseId: number) => {
  const res = await makeApiCall<IGenericResponse<IBillDetail>>({
    url: 'api/Bill/detail',
    method: 'GET',
    params: {
      purchaseId,
    },
  });
  return res;
};
