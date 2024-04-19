import {
  IAddShopSaleManagement,
  IGenericResponse,
  ISaleFilterList,
  ISaleListResponse,
  IPreviewSaleResponse,
  ISaleDetail,
  IUserResponse,
} from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const CreateSale = async ({
  salePersonCode,
  shopId,
  comments,
  saleDetails,
}: Partial<IAddShopSaleManagement>) => {
  const res = await makeApiCall<IGenericResponse<{ saleId: number }>>({
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

export const HoldSale = async ({
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
export const GetSaleList = async (
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
      status: filterSearch.statusId?.statusId,
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
export const CancelSale = async (saleId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/sale/cancel',
    method: 'PUT',
    params: {
      saleId,
    },
  });
  return res;
};
export const GetSaleDetail = async (saleId: number) => {
  const res = await makeApiCall<IGenericResponse<IPreviewSaleResponse>>({
    url: 'api/sale/preview',
    method: 'GET',
    params: {
      saleId,
    },
  });
  return res;
};
export const CreateSaleLineItem = async ({
  saleId,
  saleDetails,
}: {
  saleId: number;
  saleDetails: ISaleDetail;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/sale/additem',
    method: 'PUT',
    params: {
      saleId,
    },
    data: saleDetails,
  });
  return res;
};

export const DeleteSaleLineItem = async ({
  saleId,
  saleDetailId,
}: {
  saleId: number;
  saleDetailId: number;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/sale/deleteitem',
    method: 'PUT',
    params: {
      saleId,
      saleDetailId,
    },
  });
  return res;
};
export const UpdateSaleLineItem = async ({
  saleDetailId,
  saleDetails,
}: {
  saleDetailId: number;
  saleDetails: ISaleDetail;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/sale/updateitem',
    method: 'PUT',
    params: {
      saleDetailId,
    },
    data: saleDetails,
  });
  return res;
};
export const ChangeSaleStatus = async ({
  saleId,
  saleStatus,
}: {
  saleId: number;
  saleStatus: number;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/sale/changestatus',
    method: 'PUT',
    params: {
      saleId,
      saleStatus,
    },
  });
  return res;
};
export const RevokeSale = async ({
  shopId,
  returnSaleDetails,
}: Partial<IAddShopSaleManagement>) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/sale/return',
    method: 'PUT',
    data: {
      shopId,
      returnSaleDetails,
    },
  });
  return res;
};
export const GetShopAccountSummary = async (shopId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/shopaccount/summary',
    method: 'GET',
    params: {
      shopId,
    },
  });
  return res;
};
export const RecordExpenseInShopAccount = async ({
  expenseId,
  shopId,
  amount,
  comments,
}: {
  expenseId: number;
  shopId: number;
  amount: number;
  comments?: string;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'POST',
    url: 'api/shopaccount/add/expense',
    data: {
      expenseId,
      shopId,
      amount,
      comments,
    },
  });
  return res;
};
export const GetShopOfficers = async (
  {
    RoleName,
    ShopId,
    Status,
    pageNumber = 1,
    pageSize = 10000,
  }: {
    RoleName?: string | null;
    ShopId?: number | null;
    Status?: string | null;
    pageNumber?: number;
    pageSize?: number;
  },
  controller?: AbortController
) => {
  const res = await makeApiCall<
    IGenericResponse<{
      totalItemCount: number;
      items: IUserResponse[];
    }>
  >({
    method: 'GET',
    url: 'api/User/list',
    params: {
      RoleName: RoleName,
      ShopId: ShopId,
      Status: Status,
      PageNumber: pageNumber,
      PageSize: pageSize,
    },
    signal: controller?.signal,
  });
  return res;
};
export const DiscardExpenseFromShopAccount = async ({
  shopAccountDetailId,
}: {
  shopAccountDetailId: number;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/shopaccount/delete/expense',
    method: 'PUT',
    params: {
      shopAccountDetailId,
    },
  });
  return res;
};
