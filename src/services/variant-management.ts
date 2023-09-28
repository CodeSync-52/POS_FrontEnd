import { makeApiCall } from 'src/utils';
import {
  IGenericResponse,
  IVariantData,
  IVariantDetailsData,
} from 'src/interfaces';

export const addVariantGroupApi = async (name: string) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'POST',
    url: 'api/Variant/group/add',
    data: {
      name,
    },
  });
  return res;
};
export const updateVariantGroupApi = async ({
  variantGroupId,
  name,
}: {
  variantGroupId: number;
  name: string;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: 'api/Variant/group/update',
    params: {
      variantGroupId,
    },
    data: {
      name,
    },
  });
  return res;
};
export const variantGroupListApi = async ({
  pageNumber = 1,
  pageSize = 50,
}: {
  pageNumber: number;
  pageSize: number;
}) => {
  const res = await makeApiCall<
    IGenericResponse<{ items: IVariantData[]; totalItemCount: number }>
  >({
    method: 'GET',
    url: 'api/Variant/group/list',
    params: {
      pageNumber,
      pageSize,
    },
  });
  return res;
};
export const variantGroupUpdateStatus = async (variantGroupId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: 'api/Variant/group/changestatus',
    params: {
      variantGroupId,
    },
  });
  return res;
};
export const addVariantApi = async ({
  name,
  displayName,
  variantGroupId,
}: {
  name: string;
  displayName: string;
  variantGroupId: number;
}) => {
  const res = makeApiCall<IGenericResponse<null>>({
    method: 'POST',
    url: 'api/Variant/add',
    data: {
      name,
      displayName,
      variantGroupId,
    },
  });
  return res;
};
export const updateVariantApi = async ({
  variantId,
  name,
  displayName,
  variantGroupId,
}: {
  variantId: number;
  name: string;
  displayName: string;
  variantGroupId: number;
}) => {
  const res = makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: 'api/Variant/update',
    params: {
      variantId,
    },
    data: {
      name,
      displayName,
      variantGroupId,
    },
  });
  return res;
};
export const changeVariantStatus = async (variantId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: 'api/Variant/changestatus',
    params: {
      variantId,
    },
  });
  return res;
};
export const variantListApi = async ({
  pageNumber = 1,
  pageSize = 50,
}: {
  pageNumber: number;
  pageSize: number;
}) => {
  const res = await makeApiCall<
    IGenericResponse<{ items: IVariantDetailsData[]; totalItemCount: number }>
  >({
    method: 'GET',
    url: 'api/Variant/list',
    params: {
      pageNumber,
      pageSize,
    },
  });
  return res;
};
export const variantListByIdApi = async ({
  status,
  variantGroupId,
}: {
  status: string | string[];
  variantGroupId: number;
}) => {
  const res = await makeApiCall<IGenericResponse<IVariantDetailsData[]>>({
    method: 'GET',
    url: 'api/variant/listbyvariantgroup',
    params: {
      variantGroupId,
      status,
    },
  });
  return res;
};
