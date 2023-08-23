import {
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
    url: '',
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
