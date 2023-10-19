import { IGenericResponse } from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const acceptStrApi = async (grnId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/str/accept',
    method: 'POST',
    data: {
      grnId,
    },
  });
  return res;
};
export const rejectStrApi = async (grnId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/str/reject',
    method: 'POST',
    data: {
      grnId,
    },
  });
  return res;
};
