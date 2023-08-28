import {
  IBillDetail,
  IBillGenerationData,
  IBillGenerationDetailsInfoData,
  IBillGenerationFilter,
  IGenericResponse,
  INewBillData,
  IUpdatedBillProductList,
} from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const addBillApi = async (newBillInfo: INewBillData) => {
  const res = makeApiCall<IGenericResponse<null>>({
    method: 'POST',
    url: 'api/bill/add',
    data: {
      ...newBillInfo,
    },
  });
  return res;
};
export const updateBillApi = async ({
  billId,
  productList,
}: {
  billId: number;
  productList: IUpdatedBillProductList[];
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/bill/update',
    method: 'PUT',
    params: {
      billId,
    },
    data: {
      productList,
    },
  });
  return res;
};
export const cancelBillApi = async (BillId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/bill/cancel',
    method: 'PUT',
    params: {
      BillId,
    },
  });
  return res;
};
export const completeBillApi = async (BillId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/bill/complete',
    method: 'PUT',
    params: {
      BillId,
    },
  });
  return res;
};
export const billDetailsApi = async (purchaseId: number) => {
  const res = await makeApiCall<IGenericResponse<IBillDetail>>({
    url: 'api/Bill/detail',
    method: 'GET',
    params: {
      purchaseId,
    },
  });
  return res;
};
export const billDetailInfoApi = async (BillId: number) => {
  const res = await makeApiCall<
    IGenericResponse<IBillGenerationDetailsInfoData>
  >({
    url: 'api/bill/detailinfo',
    method: 'GET',
    params: {
      BillId,
    },
  });
  return res;
};

export const billListApi = async ({
  PageNumber = 1,
  PageSize = 50,
  filterSearch,
}: {
  PageNumber: number;
  PageSize: number;
  filterSearch?: IBillGenerationFilter;
}) => {
  const res = await makeApiCall<
    IGenericResponse<{ items: IBillGenerationData[]; totalItemCount: number }>
  >({
    url: 'api/Bill/list',
    method: 'GET',
    params: {
      UserId: filterSearch?.userId,
      FullName: filterSearch?.userName,
      FromDate: filterSearch?.FromDate,
      ToDate: filterSearch?.ToDate,
      PageNumber,
      PageSize,
    },
  });
  return res;
};
