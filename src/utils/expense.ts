import { QTableColumn } from 'quasar';
import { Iexpenses } from 'src/interfaces';
export const expenseColumns: QTableColumn<Iexpenses>[] = [
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
