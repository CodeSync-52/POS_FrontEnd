import { IGenericResponse } from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const GetSetting = async () => {
  const res = await makeApiCall<
    IGenericResponse<{ receiptDescription: null | string }>
  >({
    method: 'GET',
    url: 'api/setting',
  });
  return res;
};
export const SaveSetting = async ({
  receiptDescription,
}: {
  receiptDescription: string;
}) => {
  const res = await makeApiCall<IGenericResponse<string>>({
    url: 'api/setting/save',
    method: 'POST',
    data: {
      receiptDescription,
    },
  });
  return res;
};
