import { IGenericResponse, ISalesManagementData } from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const salesManagementListApi = async ({
  PageNumber,
  PageSize,
}: {
  PageNumber: number;
  PageSize: number;
}) => {
  const res = await makeApiCall<
    IGenericResponse<{ items: ISalesManagementData[]; totalItemCount: number }>
  >({
    method: 'GET',
    url: '',
    params: {
      PageNumber,
      PageSize,
    },
  });
  return res;
};
