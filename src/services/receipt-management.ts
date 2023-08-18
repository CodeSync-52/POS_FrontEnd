import { IGenericResponse, IReceiptData } from 'src/interfaces';
import { makeApiCall } from 'src/utils';
export const receiptListApi = async ({
  ToDate,
  PageNumber = 1,
  PageSize = 50,
  FromDate,
  UserId,
  FullName,
}: {
  ToDate: string | null;
  FromDate: string | null;
  UserId: number | null;
  FullName: string | null;
  PageNumber: number;
  PageSize: number;
}) => {
  const res = await makeApiCall<
    IGenericResponse<{ items: IReceiptData[]; totalItemsCount: number }>
  >({
    method: 'GET',
    url: 'api/Purchase/list',
    params: {
      UserId,
      ToDate,
      FromDate,
      FullName,
      PageNumber,
      PageSize,
    },
  });
  return res;
};
export const cancelReceiptApi = async (purchaseId: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: 'api/Purchase/cancel',
    params: {
      purchaseId,
    },
  });
  return res;
};
