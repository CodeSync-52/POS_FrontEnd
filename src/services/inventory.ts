import {
  IGenericResponse,
  IInventoryFilterSearch,
  IInventoryListResponse,
  IProductWithVariantDTOs,
} from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const addInventoryApi = async ({
  shopId,
  productWithVariantDTOs,
}: {
  shopId: number;
  productWithVariantDTOs: IProductWithVariantDTOs[];
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/inventory/add',
    method: 'POST',
    data: {
      shopId,
      productWithVariantDTOs,
    },
  });
  return res;
};
export const inventoryListApi = async (
  {
    PageNumber = 1,
    PageSize = 50,
    filterSearch,
  }: {
    PageNumber: number;
    PageSize: number;
    filterSearch: IInventoryFilterSearch;
  },
  controller?: AbortController
) => {
  const { FromDate, ToDate } = filterSearch;
  const res = await makeApiCall<
    IGenericResponse<{
      items: IInventoryListResponse[];
      totalItemCount: number;
    }>
  >({
    url: 'api/inventory/list',
    method: 'GET',
    params: {
      PageNumber,
      PageSize,
      FromDate,
      ToDate,
    },
    signal: controller?.signal,
  });
  return res;
};
