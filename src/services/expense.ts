import { IGenericResponse, IExpenses } from 'src/interfaces';
import { makeApiCall } from 'src/utils';
export const GetExpenseList = async ({
  pageNumber,
  pageSize,
}: {
  pageNumber: number;
  pageSize: number;
}) => {
  const res = await makeApiCall<
    IGenericResponse<{
      totalItemCount: number;
      items: IExpenses[];
    }>
  >({
    method: 'GET',
    url: `api/expensetype/list?pageNumber=${pageNumber}&pageSize=${pageSize}`,
  });
  return res;
};
export const CreateExpense = async (expenseTypeName: string) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'POST',
    url: 'api/expensetype/add',
    data: { expenseTypeName: expenseTypeName },
  });
  return res;
};
export const UpdateExpense = async ({
  expenseId,
  newName,
}: {
  expenseId: number;
  newName: string;
}) => {
  const res = await makeApiCall<IGenericResponse<null>>({
    method: 'PUT',
    url: `api/expensetype/update?id=${expenseId}`,
    data: { expenseTypeName: newName },
  });
  return res;
};
