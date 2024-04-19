import { IGenericResponse, IShopBasicInfo, IShopResponse } from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export const GetShopList = async ({
  PageNumber = 1,
  PageSize = 500,
  filterSearch,
}: {
  PageNumber?: number;
  PageSize?: number;
  filterSearch?:
    | {
        ShopName: string | null;
        Status: string | null;
        OrderBy: string | null;
      }
    | undefined;
}) => {
  if (filterSearch) {
    const { ShopName, Status } = filterSearch;
    const res = await makeApiCall<
      IGenericResponse<{ totalItemCount: number; items: IShopResponse[] }>
    >({
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
  } else {
    const res = await makeApiCall<
      IGenericResponse<{ totalItemCount: number; items: IShopResponse[] }>
    >({
      url: 'api/shop/list',
      method: 'GET',
      params: {
        PageNumber,
        PageSize,
      },
    });
    return res;
  }
};
export const ChangeShopStatus = async (id: number) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: `api/shop/changestatus?shopId=${id}`,
    method: 'PUT',
  });
  return res;
};
export const CreateShop = async (shopData: IShopBasicInfo) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/shop/add',
    method: 'POST',
    data: shopData,
  });
  return res;
};
export const UpdateShop = async ({
  shopId,
  name,
  phone,
  address,
  code,
}: {
  shopId: number;
  name: string;
  phone: string;
  address: string;
  code: string;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    url: 'api/shop/update',
    method: 'PUT',
    params: {
      shopId,
    },
    data: {
      name,
      phone,
      address,
      code,
    },
  });
  return res;
};
