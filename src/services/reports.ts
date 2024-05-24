import {
  IGenericResponse,
  IAccountReportData,
  IHOSaleDetailReportData,
  IHOArticleReportData,
  IHOStockReportData,
  IOutStandingReportData,
  IShopStockReportData,
  IShopSaleStockReportData,
  IVendorSaleStockReportData,
  IDailySaleReportData,
  ISlowArticleSaleReportData,
  IArticleHistoryReport,
  IArticleSaleDistributionByColorDetail,
  IShelfArticleSaleReportData,
  IOfflineShopArticleReportData,
  ICurrentClosingReportData,
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
export const GetVendorSaleStockReport = async ({
  fromDate,
  toDate,
  userId,
}: {
  fromDate: string;
  toDate: string;
  userId: number;
}) => {
  const res = await makeApiCall<
    IGenericResponse<{ list: IVendorSaleStockReportData[] }>
  >({
    method: 'POST',
    url: 'api/report/vendorstocksale',
    data: {
      fromDate,
      toDate,
      userId,
    },
  });
  return res;
};
export const GetDailySaleReport = async ({
  fromDate,
  toDate,
  shopIds,
  showOnlyDiscount,
}: {
  fromDate: string;
  toDate: string;
  shopIds: string | number[] | null;
  showOnlyDiscount: number;
}) => {
  const res = await makeApiCall<
    IGenericResponse<{ list: IDailySaleReportData[] }>
  >({
    method: 'POST',
    url: 'api/report/dailysale',
    data: {
      fromDate,
      toDate,
      shopIds,
      showOnlyDiscount,
    },
  });
  return res;
};
export const GetSlowArticleSaleReport = async ({
  fromDate,
  toDate,
  shopIds,
  stockQuantity,
  meaningfulInvGreaterThanDays,
  saleLessThanPercentage,
}: {
  fromDate: string;
  toDate: string;
  shopIds: string | number[] | null;
  stockQuantity: number;
  meaningfulInvGreaterThanDays: number;
  saleLessThanPercentage: number;
}) => {
  const res = await makeApiCall<
    IGenericResponse<{ list: ISlowArticleSaleReportData[] }>
  >({
    method: 'POST',
    url: 'api/report/slowarticlesale',
    data: {
      fromDate,
      toDate,
      shopIds,
      stockQuantity,
      meaningfulInvGreaterThanDays,
      saleLessThanPercentage,
    },
  });
  return res;
};
export const GetProfitLossReport = async ({
  fromDate,
  toDate,
  shopId,
}: {
  fromDate: string;
  toDate: string;
  shopId: number;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'POST',
    url: 'api/report/profitloss',
    data: {
      fromDate,
      toDate,
      shopId,
    },
  });
  return res;
};
export const GetCashClosingReport = async ({
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
    url: 'api/report/cashclosing',
    data: {
      shopIds,
      fromDate,
      toDate,
    },
  });
  return res;
};
export const GetComissionReport = async ({
  shopId,
  fromDate,
  toDate,
}: {
  shopId: number;
  fromDate: string;
  toDate: string;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'POST',
    url: 'api/report/articlecomission',
    data: {
      shopId,
      fromDate,
      toDate,
    },
  });
  return res;
};

export const GetOfflineShopArticleInventoryReport = async (
  {
    shopId,
    categoryId,
    sortBy,
    showZeroStock,
  }: {
    shopId: number;
    categoryId: number;
    sortBy: number;
    showZeroStock: boolean;
  },
  controller?: AbortController
) => {
  const res = await makeApiCall<
    IGenericResponse<IOfflineShopArticleReportData[]>
  >({
    method: 'POST',
    url: 'api/report/offlineshoparticleinventory',
    data: {
      shopId: shopId,
      categoryId: categoryId,
      sortBy: sortBy,
      showZeroStock,
    },
    signal: controller?.signal,
  });
  return res;
};

export const GetShopwiseStockTransferReport = async ({
  shopIds,
  fromDate,
  toDate,
  sortBySale,
}: {
  shopIds: string | number[] | null;
  fromDate: string;
  toDate: string;
  sortBySale: boolean;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'POST',
    url: 'api/report/shopwisestocktransfer',
    data: {
      shopIds,
      fromDate,
      toDate,
      sortBySale,
    },
  });
  return res;
};
export const GetNewArticleSaleAndStockReport = async ({
  shopIds,
  fromDate,
  toDate,
  sortBySale,
}: {
  shopIds: string | number[] | null;
  fromDate: string;
  toDate: string;
  sortBySale: boolean;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'POST',
    url: 'api/report/newarticlesalestock',
    data: {
      shopIds,
      fromDate,
      toDate,
      sortBySale,
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
    shopIds,
    categoryId,
    productIds,
    excludeZeroStock,
    sortByArticle,
  }: {
    shopIds: string | number[] | null;
    categoryId: number;
    productIds: string;
    excludeZeroStock: boolean;
    sortByArticle: boolean;
  },
  controller?: AbortController
) => {
  const res = await makeApiCall<IGenericResponse<IShopStockReportData[]>>({
    method: 'POST',
    url: 'api/report/shopstock',
    data: {
      shopIds: shopIds,
      categoryId: categoryId,
      productIds: productIds,
      excludeZeroStock: excludeZeroStock,
      sortByArticle,
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
    sortByArticle,
  }: {
    shopId: number;
    categoryId: number;
    productIds: string;
    fromDate: string;
    toDate: string;
    sortByArticle: boolean;
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
      sortByArticle,
    },
    signal: controller?.signal,
  });
  return res;
};

export const GetArticleSaleByColorDetailReport = async (
  {
    toDate,
    fromDate,
    categoryId,
  }: {
    toDate: string | null;
    fromDate: string | null;
    categoryId: number | null;
  },
  controller?: AbortController
) => {
  const res = await makeApiCall<
    IGenericResponse<IArticleSaleDistributionByColorDetail[]>
  >({
    method: 'POST',
    url: 'api/report/articlesaledistributionbycolor',
    data: {
      categoryId: categoryId,
      toDate: toDate,
      fromDate: fromDate,
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
export const GetArticleHistoryReport = async (
  {
    toDate,
    fromDate,
    productId,
  }: {
    toDate: string;
    fromDate: string;
    productId: number;
  },
  controller?: AbortController
) => {
  const res = await makeApiCall<IGenericResponse<IArticleHistoryReport>>({
    method: 'POST',
    url: 'api/report/articlehistory',
    data: {
      productId: productId,
      toDate: toDate,
      fromDate: fromDate,
    },
    signal: controller?.signal,
  });
  return res;
};
export const GetShelfArticleSaleReport = async ({
  fromDate,
  toDate,
  shopIds,
  saleQuantity,
  showZeroStock,
}: {
  fromDate: string;
  toDate: string;
  shopIds: string | number[] | null;
  saleQuantity: number;
  showZeroStock: boolean;
}) => {
  const res = await makeApiCall<
    IGenericResponse<IShelfArticleSaleReportData[]>
  >({
    method: 'POST',
    url: 'api/report/shelfarticlesale',
    data: {
      fromDate,
      toDate,
      shopIds,
      saleQuantity,
      showZeroStock,
    },
  });
  return res;
};
export const GetBestSellingArticleReport = async ({
  shopIds,
  topProductCount,
  months,
  userId,
}: {
  shopIds: string | number[] | null;
  months: string | number[] | null;
  topProductCount: number;
  userId: number;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'POST',
    url: 'api/report/bestsellingarticle',
    data: {
      shopIds,
      topProductCount,
      months,
      userId,
    },
  });
  return res;
};
export const GetCurrentClosingReport = async (controller?: AbortController) => {
  const res = await makeApiCall<IGenericResponse<ICurrentClosingReportData[]>>({
    method: 'POST',
    url: 'api/report/currentclosing',
    signal: controller?.signal,
  });
  return res;
};
