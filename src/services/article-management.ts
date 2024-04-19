import { makeApiCall } from 'src/utils';
import {
  IArticleData,
  IBillingHistoryResponse,
  IGenericResponse,
} from 'src/interfaces';

export const CreateArticle = async ({
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
export const GetArticleList = async (
  {
    PageNumber = 1,
    PageSize = 1000000,
    Name,
    Status,
    ShowZeroWholePrice,
    CategoryId,
  }: {
    Name?: string | null;
    Status?: string | null;
    ShowZeroWholePrice?: number | null;
    CategoryId?: number | null;
    PageNumber: number;
    PageSize: number;
  },
  controller?: AbortController
) => {
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
      Name,
      Status,
      ShowZeroWholePrice,
      CategoryId,
    },
    signal: controller?.signal,
  });
  return res;
};
export const ChangeArticleStatus = async (productId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: 'api/Product/changestatus',
    params: {
      productId,
    },
  });
  return res;
};
export const UpdateArticle = async ({
  productId,
  name,
  description,
  categoryId,
  image,
  wholeSalePrice,
  retailPrice,
  costPrice,
  commission,
}: {
  productId: number;
  name: string;
  description: string;
  categoryId: number | null;
  image: string | undefined;
  wholeSalePrice: number;
  retailPrice: number;
  costPrice: number;
  commission: number;
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
      commission,
    },
  });
  return res;
};
export const GetArticleDetail = async (productId: number) => {
  const res = await makeApiCall<IGenericResponse<IArticleData>>({
    method: 'GET',
    url: 'api/product/detail',
    params: {
      productId,
    },
  });
  return res;
};
export const GetArticlebillingHistory = async (productId: number) => {
  const res = await makeApiCall<IGenericResponse<IBillingHistoryResponse[]>>({
    url: 'api/product/billinghistory',
    method: 'GET',
    params: {
      productId,
    },
  });
  return res;
};
