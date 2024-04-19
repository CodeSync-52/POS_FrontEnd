import { QTableColumn } from 'quasar';
import { IExpenses } from 'src/interfaces';
export const expenseColumns: QTableColumn<IExpenses>[] = [
  {
    name: 'expenseTypeName',
    required: true,
    label: 'Expense Name',
    align: 'left',
    field: (row) => row.expenseTypeName,
  },
  {
    name: 'action',
    label: 'Action',
    align: 'left',
    field: (row) => row,
  },
];
