import { IGenericResponse, ISelectedPayload } from 'src/interfaces';
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
