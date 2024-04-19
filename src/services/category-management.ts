import {
  ICategoryData,
  ICategoryDetailsData,
  IGenericResponse,
  IArticleCategory,
} from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const ChangeCategoryStatus = async (categoryId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: 'api/Category/changestatus',
    params: {
      categoryId,
    },
  });
  return res;
};
export const ChangeSubCategoryStatus = async (categoryId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: 'api/Category/subcategory/changestatus',
    params: {
      categoryId,
    },
  });
  return res;
};
export const CreateCategory = async (name: string) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'POST',
    url: 'api/Category/add',
    data: {
      name,
      description: '',
    },
  });
  return res;
};
export const CreateSubcategory = async ({
  name,
  parentCategoryId,
}: {
  name: string;
  parentCategoryId: number;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'POST',
    url: 'api/Category/subcategory/add',
    data: {
      name,
      description: '',
      parentCategoryId,
    },
  });
  return res;
};
export const GetCategoryList = async ({
  pageNumber = 1,
  pageSize = 50,
}: {
  pageNumber: number;
  pageSize: number;
}) => {
  const res = await makeApiCall<
    IGenericResponse<{ items: ICategoryData[]; totalItemCount: number }>
  >({
    method: 'GET',
    url: 'api/Category/list',
    params: {
      pageNumber,
      pageSize,
    },
  });
  return res;
};
export const GetSubcategoryList = async ({
  parentCategory,
  pageNumber = 1,
  pageSize = 50,
}: {
  parentCategory: number;
  pageNumber: number;
  pageSize: number;
}) => {
  const res = await makeApiCall<
    IGenericResponse<{ items: ICategoryDetailsData[]; totalItemCount: number }>
  >({
    method: 'GET',
    url: 'api/Category/subcategory/list',
    params: {
      parentCategoryId: parentCategory,
      pageNumber,
      pageSize,
    },
  });
  return res;
};
export const UpdateCategory = async ({
  categoryId,
  name,
}: {
  categoryId: number;
  name: string;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: 'api/Category/update',
    params: {
      categoryId,
    },
    data: {
      name,
      description: '',
    },
  });
  return res;
};
export const GetCategoryTree = async () => {
  const res = await makeApiCall<
    IGenericResponse<{ categoryTree: IArticleCategory[] }>
  >({
    method: 'GET',
    url: 'api/Category/tree',
  });
  return res;
};
