import {
  IAddShopSaleManagement,
  IGenericResponse,
  ISaleFilterList,
  ISaleListResponse,
} from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const addShopSaleManagementApi = async ({
  salePersonCode,
  shopId,
  comments,
  saleDetails,
}: Partial<IAddShopSaleManagement>) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/sale/add',
    method: 'POST',
    data: {
      salePersonCode,
      shopId,
      comments,
      saleDetails,
    },
  });
  return res;
};

export const holdBillApi = async ({
  salePersonCode,
  shopId,
  comments,
  saleDetails,
}: Partial<IAddShopSaleManagement>) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/sale/hold',
    method: 'POST',
    data: {
      salePersonCode,
      shopId,
      comments,
      saleDetails,
    },
  });
  return res;
};
export const getSaleListApi = async (
  {
    filterSearch,
    pageNumber = 1,
    pageSize = 50,
  }: { filterSearch: ISaleFilterList; pageNumber: number; pageSize: number },
  controller?: AbortController
) => {
  const res = await makeApiCall<
    IGenericResponse<{
      totalItemCount: number;
      items: ISaleListResponse[];
    }>
  >({
    method: 'GET',
    url: 'api/sale/list',
    params: {
      status: filterSearch.statusId,
      shopId: filterSearch.shopId,
      invoiceNumber: filterSearch.invoiceNumber,
      fromDate: filterSearch.fromDate,
      toDate: filterSearch.toDate,
      pageNumber: pageNumber,
      pageSize: pageSize,
    },
    signal: controller?.signal,
  });
  return res;
};
