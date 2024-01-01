import { QTableColumn } from 'quasar';
import { IGrnDetailsWithId, IShopSaleExpenses } from 'src/interfaces';

export const saleShopSelectedGrnInventoryTableColumn: QTableColumn<IGrnDetailsWithId>[] =
  [
    {
      name: 'productImage',
      label: 'Product Image',
      field: (row) => row.productImage,
      align: 'left',
    },
    {
      name: 'productCode',
      label: 'Product Code',
      field: (row) => row.productCode?.split(',')[0] || '-',
      align: 'left',
    },
    {
      name: 'availableQuantity',
      label: 'Available Quantity',
      field: (row) => row.quantity,
      align: 'left',
    },
    {
      name: 'dispatchQuantity',
      label: 'Dispatch Quantity',
      field: (row) => row.quantity,
      align: 'left',
    },
    {
      name: 'retailPrice',
      label: 'Retail Price',
      field: (row) => row.retailPrice,
      align: 'left',
    },
    {
      name: 'discount',
      label: 'Discount',
      field: () => '',
      align: 'left',
    },
    {
      name: 'action',
      label: 'Action',
      field: () => '',
      align: 'left',
    },
  ];
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
  {
    name: 'saveRow',
    required: true,
    label: 'Action',
    align: 'left',
    field: () => '',
  },
];
