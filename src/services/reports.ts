import { IGenericResponse, IAccountReportData } from 'src/interfaces';
import { makeApiCall } from 'src/utils';
export const accountReportListApi = async (
  {
    ToDate,
    FromDate,
    UserId,
  }: {
    ToDate: string | null;
    FromDate: string | null;
    UserId: number | null;
  },
  controller?: AbortController
) => {
  const res = await makeApiCall<
    IGenericResponse<{ list: IAccountReportData[] }>
  >({
    method: 'POST',
    url: 'api/report/account',
    data: {
      userId: UserId,
      toDate: ToDate,
      fromDate: FromDate,
    },
    signal: controller?.signal,
  });
  return res;
};

export const userOutStandingReportListApi = async (
  {
    customerGroupId,
    includeZeroBalance,
  }: {
    customerGroupId: number | null;
    includeZeroBalance: boolean;
  },
  controller?: AbortController
) => {
  const res = await makeApiCall<
    IGenericResponse<{ list: IAccountReportData[] }>
  >({
    method: 'POST',
    url: 'api/report/useroutstanding',
    data: {
      customerGroupId,
      includeZeroBalance,
    },
    signal: controller?.signal,
  });
  return res;
};

export const HOStockReportListApi = async (
  {
    userId,
    categoryId,
    productIds,
    includeZeroStock,
    showOnlyZeroStock,
    sortByStock,
  }: {
    userId: number | null;
    categoryId?: number | null;
    productIds?: string | null;
    includeZeroStock: string | boolean;
    showOnlyZeroStock: string | boolean;
    sortByStock: string | boolean;
  },
  controller?: AbortController
) => {
  const res = await makeApiCall<
    IGenericResponse<{ list: IAccountReportData[] }>
  >({
    method: 'POST',
    url: 'api/report/hostock',
    data: {
      userId,
      categoryId,
      productIds,
      includeZeroStock,
      showOnlyZeroStock,
      sortByStock,
    },
    signal: controller?.signal,
  });
  return res;
};

export const HOArticleSaleReportListApi = async (
  {
    purchaseFromCustomerGroup,
    purchaseFromCustomer,
    productIds,
    saleToCustomerGroup,
    endDate,
    startDate,
    sortByQty,
    saleToCustomer,
  }: {
    purchaseFromCustomerGroup: null | number;
    purchaseFromCustomer: null | number;
    saleToCustomerGroup: null | number;
    saleToCustomer: null | number;
    startDate: null | string;
    endDate: null | string;
    sortByQty: boolean;
    productIds: string;
  },
  controller?: AbortController
) => {
  const res = await makeApiCall<
    IGenericResponse<{ list: IAccountReportData[] }>
  >({
    method: 'POST',
    url: 'api/report/hoarticlesale',
    data: {
      purchaseFromCustomerGroup,
      purchaseFromCustomer,
      productIds,
      saleToCustomerGroup,
      toDate: endDate,
      saleToCustomer,
      fromDate: startDate,
      sortByQty,
    },
    signal: controller?.signal,
  });
  return res;
};
