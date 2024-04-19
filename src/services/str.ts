import { IGenericResponse } from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const AcceptSTR = async (grnId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/str/accept',
    method: 'POST',
    data: {
      grnId,
    },
  });
  return res;
};
export const RejectSTR = async ({
  grnId,
  reason,
}: {
  grnId: number;
  reason: string;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/str/reject',
    method: 'POST',
    data: {
      grnId,
      reason,
    },
  });
  return res;
};
