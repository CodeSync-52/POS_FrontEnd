import { makeApiCall } from 'src/utils';
import { IArticleData, IGenericResponse } from 'src/interfaces';

export const newArticleApi = async ({
  name,
  description,
  categoryId,
  image,
}: {
  name: string;
  description: string;
  categoryId: number;
  image: string | undefined;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'POST',
    url: 'api/Product/add',
    data: {
      name,
      description,
      categoryId,
      image,
    },
  });
  return res;
};
export const articleListApi = async ({
  PageNumber = 50,
  PageSize = 50,
}: {
  PageNumber: number;
  PageSize: number;
}) => {
  const res = await makeApiCall<
    IGenericResponse<{
      totalItemCount: number;
      items: IArticleData[];
    }>
  >({
    method: 'GET',
    url: 'api/Product/list',
    params: {
      PageNumber,
      PageSize,
    },
  });
  return res;
};
export const changeArticleStatus = async (productId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: 'api/Product/changestatus',
    params: {
      productId,
    },
  });
  return res;
};
export const updateProductApi = async ({
  productId,
  name,
  description,
  categoryId,
  image,
  wholeSalePrice,
  retailPrice,
  costPrice,
}: {
  productId: number;
  name: string;
  description: string;
  categoryId: number | null;
  image: string | undefined;
  wholeSalePrice: number;
  retailPrice: number;
  costPrice: number;
}) => {
  const id = categoryId === null ? undefined : categoryId;
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: 'api/Product/update',
    params: {
      productId,
    },
    data: {
      name,
      description,
      categoryId: id,
      image,
      wholeSalePrice,
      retailPrice,
      costPrice,
    },
  });
  return res;
};
