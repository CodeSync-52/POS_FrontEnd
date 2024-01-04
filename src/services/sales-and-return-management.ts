import { IAddShopSaleManagement, IGenericResponse } from 'src/interfaces';
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
