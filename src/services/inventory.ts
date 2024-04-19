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
  const res = await makeApiCall<IGenericResponse<number>>({
    url: 'api/grn/warehouse/add',
    method: 'POST',
    data: {
      shopId,
      productWithVariantDTOs,
    },
  });
  return res;
};
export const inventoryDetailApi = async (
  {
    PageNumber = 1,
    ShopId,
    PageSize = 50,
    filterSearch,
    CategoryId,
  }: {
    PageNumber: number;
    PageSize: number;
    ShopId: string | null;
    filterSearch: IInventoryFilterSearch;
    CategoryId?: number | null;
  },
  controller?: AbortController
) => {
  const { ProductId, keyword, ProductCode } = filterSearch;
  const res = await makeApiCall<
    IGenericResponse<{
      inventoryDetails: IInventoryListResponse[];
      totalCountInventoryDetails: number;
    }>
  >({
    url: 'api/inventory/detail',
    method: 'GET',
    params: {
      PageNumber,
      PageSize,
      ShopId,
      CategoryId,
      ProductId,
      ProductCode,
      keyword,
    },
    signal: controller?.signal,
  });
  return res;
};
