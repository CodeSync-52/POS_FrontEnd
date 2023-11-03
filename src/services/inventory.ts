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
  }: {
    PageNumber: number;
    PageSize: number;
    ShopId: number | null;
    filterSearch: IInventoryFilterSearch;
  },
  controller?: AbortController
) => {
  const { ProductId, ProductCode } = filterSearch;
  const res = await makeApiCall<
    IGenericResponse<{
      inventoryDetails: IInventoryListResponse[];
      shopId: number;
      shopName: string;
      totalCountInventoryDetails: number;
    }>
  >({
    url: 'api/inventory/detail',
    method: 'GET',
    params: {
      PageNumber,
      PageSize,
      ShopId,
      ProductId,
      ProductCode,
    },
    signal: controller?.signal,
  });
  return res;
};
