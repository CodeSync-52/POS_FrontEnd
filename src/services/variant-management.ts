import { makeApiCall } from 'src/utils';
import {
  IGenericResponse,
  IVariantData,
  IVariantDetailsData,
} from 'src/interfaces';

export const CreateVariantGroup = async (name: string) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'POST',
    url: 'api/Variant/group/add',
    data: {
      name,
    },
  });
  return res;
};
export const UpdateVariantGroup = async ({
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
export const GetVariantGroupList = async ({
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
export const ChangeVariantGroupStatus = async (variantGroupId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: 'api/Variant/group/changestatus',
    params: {
      variantGroupId,
    },
  });
  return res;
};
export const CreateVariant = async ({
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
export const UpdateVariant = async ({
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
export const ChangeVariantStatus = async (variantId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: 'api/Variant/changestatus',
    params: {
      variantId,
    },
  });
  return res;
};
export const GetVariantList = async ({
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
export const GetVariantListByGroupId = async ({
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
