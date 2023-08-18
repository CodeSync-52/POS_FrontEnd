import {
  ICategoryData,
  ICategoryDetailsData,
  IGenericResponse,
  IArticleCategory,
} from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const changeCategoryStatus = async (categoryId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: 'api/Category/changestatus',
    params: {
      categoryId,
    },
  });
  return res;
};
export const changeSubcategoryStatus = async (categoryId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: 'api/Category/subcategory/changestatus',
    params: {
      categoryId,
    },
  });
  return res;
};
export const createCategory = async (name: string) => {
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
export const createSubcategory = async ({
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
export const categoryListApi = async ({
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
export const subcategoryListApi = async ({
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
export const updateCategory = async ({
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
export const categoryTreeList = async () => {
  const res = await makeApiCall<
    IGenericResponse<{ categoryTree: IArticleCategory[] }>
  >({
    method: 'GET',
    url: 'api/Category/tree',
  });
  return res;
};
