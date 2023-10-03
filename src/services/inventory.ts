import { IGenericResponse, IProductWithVariantDTOs } from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const addInventoryApi = async ({
  shopId,
  productWithVariantDTOs,
}: {
  shopId: number;
  productWithVariantDTOs: IProductWithVariantDTOs[];
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/inventory/add',
    method: 'POST',
    data: {
      shopId,
      productWithVariantDTOs,
    },
  });
  return res;
};
