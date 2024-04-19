import {
  IBillDetail,
  IBillGenerationData,
  IBillData,
  IBillFilter,
  IGenericResponse,
  INewBillData,
  IProductIdWithAmount,
} from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const CreateBill = async (newBillInfo: INewBillData) => {
  const res = makeApiCall<IGenericResponse<null>>({
    method: 'POST',
    url: 'api/bill/add',
    data: {
      ...newBillInfo,
    },
  });
  return res;
};
export const UpdateBill = async ({
  billId,
  productList,
}: {
  billId: number;
  productList: IProductIdWithAmount[];
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
export const CancelBill = async (BillId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/bill/cancel',
    method: 'PUT',
    params: {
      BillId,
    },
  });
  return res;
};
export const CompleteBill = async (BillId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/bill/complete',
    method: 'PUT',
    params: {
      BillId,
    },
  });
  return res;
};
export const GetBillDetail = async (purchaseId: number) => {
  const res = await makeApiCall<IGenericResponse<IBillDetail>>({
    url: 'api/Bill/detail',
    method: 'GET',
    params: {
      purchaseId,
    },
  });
  return res;
};
export const GetBillBasicInfo = async (BillId: number) => {
  const res = await makeApiCall<IGenericResponse<IBillData>>({
    url: 'api/bill/detailinfo',
    method: 'GET',
    params: {
      BillId,
    },
  });
  return res;
};

export const GetBillList = async (
  {
    PageNumber = 1,
    PageSize = 50,
    filterSearch,
  }: {
    PageNumber: number;
    PageSize: number;
    filterSearch?: IBillFilter;
  },
  controller?: AbortController
) => {
  const res = await makeApiCall<
    IGenericResponse<{ items: IBillGenerationData[]; totalItemCount: number }>
  >({
    url: 'api/Bill/list',
    method: 'GET',
    params: {
      UserId: filterSearch?.userId,
      FullName: filterSearch?.userName?.trim(),
      FromDate: filterSearch?.FromDate,
      ToDate: filterSearch?.ToDate,
      PageNumber,
      PageSize,
      BillStatus: filterSearch?.billStatus,
      CustomerGroupId: filterSearch?.CustomerGroupId,
    },
    signal: controller?.signal,
  });
  return res;
};
export const UpdateBillClaimFreight = async ({
  billId,
  claim,
  freight,
}: {
  billId: number;
  claim: number;
  freight: number;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: 'api/bill/claimfreight',
    params: {
      billId,
      claim,
      freight,
    },
  });
  return res;
};
