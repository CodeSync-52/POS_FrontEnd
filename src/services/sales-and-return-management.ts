import { IAddShopSaleManagement, IGenericResponse } from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const addShopSaleManagementApi = async ({
  salePersonCode,
  shopId,
  totalDiscount,
  saleStatus,
  comments,
  saleDetails,
}: IAddShopSaleManagement) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/sale/add',
    method: 'POST',
    data: {
      salePersonCode,
      shopId,
      totalDiscount,
      saleStatus,
      comments,
      saleDetails,
    },
  });
  return res;
};
