import { makeApiCall } from 'src/utils';
import { IGenericResponse } from 'src/interfaces';

export const newArticleApi = async ({
  name,
  description,
  categoryId,
  image,
}: {
  name: string;
  description: string;
  categoryId: number;
  image: any;
}) => {
  const res = await makeApiCall<IGenericResponse>({
    method: 'POST',
    url: 'api/Product/add',
    data: {
      name,
      description,
      categoryId,
      image,
    },
  });
  return res;
};
