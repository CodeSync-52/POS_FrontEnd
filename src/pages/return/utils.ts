import { QTableColumn } from 'quasar';
import {
  IGrnDetailsWithId,
  IShopSaleExpenses,
  IBillStatusOptionList,
} from 'src/interfaces';

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
export const shopAllBillsTableColumn: QTableColumn[] = [
  {
    name: 'invoiceNumber',
    required: true,
    label: 'Invoice #',
    align: 'left',
    field: (row) => row.invoiceNumber,
  },
  {
    name: 'shopName',
    required: true,
    label: 'Shop Name',
    align: 'left',
    field: (row) => row.shopName,
  },
  {
    name: 'salePersonCode',
    required: true,
    label: 'Sale Person Code',
    align: 'left',
    field: (row) => row.salePersonCode,
  },
  {
    name: 'status',
    required: true,
    label: 'Status',
    align: 'left',
    field: (row) => row.status,
  },
  {
    name: 'totalDiscount',
    required: true,
    label: 'Total Discount',
    align: 'left',
    field: (row) => row.totalDiscount,
  },
  {
    name: 'totalQuantity',
    required: true,
    label: 'Total Quantity',
    align: 'left',
    field: (row) => row.totalQuantity,
  },
  {
    name: 'netAmount',
    required: true,
    label: 'Net Amount',
    align: 'left',
    field: (row) => row.netAmount,
  },
  {
    name: 'comments',
    required: true,
    label: 'Comments',
    align: 'left',
    field: (row) => (row.comments ? row.comments : 'N/A'),
  },
  {
    name: 'saleDate',
    required: true,
    label: 'Sale Date',
    align: 'left',
    field: (row) => row.saleDate,
  },
  {
    name: 'action',
    required: true,
    label: 'Action',
    align: 'left',
    field: () => '',
  },
];
export const billStatusOptionList: IBillStatusOptionList[] = [
  { name: 'Completed', statusId: 1 },
  { name: 'Hold', statusId: 2 },
  { name: 'Rejected', statusId: 3 },
];
