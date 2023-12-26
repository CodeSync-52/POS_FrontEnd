import { QTableColumn } from 'quasar';
import { IShopSaleExpenses } from 'src/interfaces';

export const shopSaleExpenseTableColumn: QTableColumn<IShopSaleExpenses>[] = [
  {
    name: 'name',
    required: true,
    label: 'Expense Name',
    align: 'left',
    field: (row) => row.name,
  },
  {
    name: 'amount',
    required: true,
    label: 'Amount',
    align: 'left',
    field: (row) => row.amount,
  },
];
