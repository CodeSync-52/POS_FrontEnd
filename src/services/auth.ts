import { IGenericResponse } from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const changeUserPassword = async ({
  oldPass,
  newPass,
}: {
  oldPass: string;
  newPass: string;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'POST',
    url: 'api/Account/password/change',
    data: {
      oldPassword: oldPass,
      newPassword: newPass,
    },
  });
  return res;
};
export const logoutUser = async () => {
  const res = await makeApiCall<IGenericResponse>({
    method: 'POST',
    url: 'api/Account/logout',
  });
  return res;
};
