import {
  IGenericResponse,
  IAccountReportData,
  IHOSaleDetailReportData,
  IHOArticleReportData,
  IHOStockReportData,
  IOutStandingReportData,
  IShopStockReportData,
  IShopSaleStockReportData,
} from 'src/interfaces';
import { makeApiCall } from 'src/utils';
export const GetAccountReport = async (
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
export const GetDateWiseShopSaleReport = async ({
  shopIds,
  fromDate,
  toDate,
}: {
  shopIds: string | number[] | null;
  fromDate: string;
  toDate: string;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'POST',
    url: 'api/report/shopsale',
    data: {
      shopIds,
      fromDate,
      toDate,
    },
  });
  return res;
};
export const GetUserOutstandingReport = async (
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
    IGenericResponse<{ list: IOutStandingReportData[] }>
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

export const GetHOStockReport = async (
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
    IGenericResponse<{ list: IHOStockReportData[] }>
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

export const GetHOArticleSaleReport = async (
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
    IGenericResponse<{ list: IHOArticleReportData[] }>
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

export const GetHOSaleDetailReport = async (
  {
    ToDate,
    FromDate,
    ProductId,
  }: {
    ToDate: string | null;
    FromDate: string | null;
    ProductId: number | null;
  },
  controller?: AbortController
) => {
  const res = await makeApiCall<
    IGenericResponse<{ list: IHOSaleDetailReportData[] }>
  >({
    method: 'POST',
    url: 'api/report/hoarticlesaledetail',
    data: {
      productId: ProductId,
      toDate: ToDate,
      fromDate: FromDate,
    },
    signal: controller?.signal,
  });
  return res;
};

export const GetHOPurchaseDetailReport = async (
  {
    ToDate,
    FromDate,
    ProductId,
  }: {
    ToDate: string | null;
    FromDate: string | null;
    ProductId: number | null;
  },
  controller?: AbortController
) => {
  const res = await makeApiCall<
    IGenericResponse<{ list: IHOSaleDetailReportData[] }>
  >({
    method: 'POST',
    url: 'api/report/hoarticlepurchaseedetail',
    data: {
      productId: ProductId,
      toDate: ToDate,
      fromDate: FromDate,
    },
    signal: controller?.signal,
  });
  return res;
};

export function wrapCsvValue(
  val: string | number | null,
  formatFn?: any,
  row?: any
) {
  let formatted: string = val === null ? '' : String(val);
  // Convert phone numbers to string to prevent exponential notation
  if (
    typeof val === 'string' &&
    String(val).length > 11 &&
    /^[\+03-9]/.test(formatted)
  ) {
    formatted = `'${formatted}'`;
  }
  if (formatFn !== undefined) {
    formatted = formatFn(val, row);
  }

  formatted = formatted.split('"').join('""');
  return `"${formatted}"`;
}
export const GetShopStockReport = async (
  {
    shopId,
    categoryId,
    productIds,
    excludeZeroStock,
    sortByQty,
  }: {
    shopId: number;
    categoryId: number;
    productIds: string;
    excludeZeroStock: boolean;
    sortByQty: boolean;
  },
  controller?: AbortController
) => {
  const res = await makeApiCall<IGenericResponse<IShopStockReportData[]>>({
    method: 'POST',
    url: 'api/report/shopstock',
    data: {
      shopId: shopId,
      categoryId: categoryId,
      productIds: productIds,
      excludeZeroStock: excludeZeroStock,
      sortByQty,
    },
    signal: controller?.signal,
  });
  return res;
};

export const GetShopArticleQuantitySaleReport = async (
  {
    shopId,
    categoryId,
    productIds,
    fromDate,
    toDate,
    sortByQty,
  }: {
    shopId: number;
    categoryId: number;
    productIds: string;
    fromDate: string;
    toDate: string;
    sortByQty: boolean;
  },
  controller?: AbortController
) => {
  const res = await makeApiCall<IGenericResponse<IShopStockReportData[]>>({
    method: 'POST',
    url: 'api/report/shoparticlequantitysale',
    data: {
      shopId: shopId,
      categoryId: categoryId,
      productIds: productIds,
      fromDate: fromDate,
      toDate: toDate,
      sortByQty,
    },
    signal: controller?.signal,
  });
  return res;
};

export const GetShopSaleStockReport = async (
  {
    toDate,
    fromDate,
    productId,
  }: {
    toDate: string | null;
    fromDate: string | null;
    productId: number | null;
  },
  controller?: AbortController
) => {
  const res = await makeApiCall<IGenericResponse<IShopSaleStockReportData[]>>({
    method: 'POST',
    url: 'api/report/saleandstockbyshop',
    data: {
      productId: productId,
      toDate: toDate,
      fromDate: fromDate,
    },
    signal: controller?.signal,
  });
  return res;
};
