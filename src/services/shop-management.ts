import { IGenericResponse, IShopResponse } from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const shopListApi = async ({
  PageNumber = 1,
  PageSize = 50,
  filterSearch,
}: {
  PageNumber: number;
  PageSize: number;
  filterSearch: {
    ShopName: string | null;
    Status: string | null;
    OrderBy: string | null;
  };
}) => {
  const { ShopName, Status } = filterSearch;
  const res = await makeApiCall<IGenericResponse<IShopResponse>>({
    url: 'api/shop/list',
    method: 'GET',
    params: {
      PageNumber,
      PageSize,
      Status,
      ShopName,
    },
  });
  return res;
};
