import moment from 'moment';
import { QTableColumn } from 'quasar';
import {
  IGrnDetailsWithdiscount,
  IShopSaleExpenses,
  IBillStatusOptionList,
  ISaleInfo,
} from 'src/interfaces';
export const buttons = [
  {
    label: 'Show Return Sales (Ctrl + F1)',
    icon: 'receipt',
    shortcut: 'F1',
    name: 'showReturnSales',
  },
  {
    label: 'Hold Bill (Ctrl + F3)',
    icon: 'hourglass_empty',
    shortcut: 'F3',
    name: 'holdBill',
  },
  {
    label: 'Show All Bill (Ctrl + F5)',
    icon: 'receipt',
    shortcut: 'F5',
    name: 'showAllBill',
  },
  {
    label: 'Show Hold Bill (Ctrl + F6)',
    icon: 'visibility',
    shortcut: 'F6',
    name: 'showHoldBill',
  },
  {
    label: 'Today Sale Summary (Ctrl + F7)',
    icon: 'trending_up',
    shortcut: 'F7',
    name: 'todaySaleSummary',
  },
];
export const saleShopSelectedGrnInventoryTableColumn: QTableColumn<IGrnDetailsWithdiscount>[] =
  [
    {
      name: 'productImage',
      label: 'Product Image',
      field: (row) => row.productImage,
      align: 'left',
    },
    {
      name: 'productName',
      label: 'Product Name',
      field: (row) => row.productName,
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
      field: (row) => row.discount,
      align: 'left',
    },
    {
      name: 'action',
      label: 'Action',
      field: () => '',
      align: 'left',
    },
  ];
export const shopSalePreviewTableColumn: QTableColumn<ISaleInfo>[] = [
  {
    name: 'productImage',
    label: 'Product Image',
    field: (row) => row.productImage,
    align: 'left',
  },
  {
    name: 'productName',
    label: 'Product Name',
    field: (row) => row.productName,
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
    field: (row) => row.availableQuantity,
    align: 'left',
  },
  {
    name: 'dispatchQuantity',
    label: 'Dispatch Quantity',
    field: (row) => row.dispatchQuantity,
    align: 'left',
  },
  {
    name: 'retailPrice',
    label: 'Retail Price',
    field: (row) => row.retailPrice,
    align: 'left',
  },
  {
    name: 'amount',
    label: 'Amount',
    field: (row) => row.amount,
    align: 'left',
  },
  {
    name: 'discount',
    label: 'Discount',
    field: (row) => row.discount,
    align: 'left',
  },
  {
    name: 'isReturn',
    label: 'Return',
    field: (row) => (row.isReturn ? 'Yes' : 'No'),
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
    name: 'expenseName',
    required: true,
    label: 'Expense Name',
    align: 'left',
    field: (row) => row.expenseName,
  },
  {
    name: 'amount',
    required: true,
    label: 'Amount',
    align: 'left',
    field: (row) => row.amount,
  },
  {
    name: 'comment',
    required: true,
    label: 'Comments',
    align: 'left',
    field: (row) => row.comment || '-',
  },
  {
    name: 'action',
    label: 'Action',
    field: () => '',
    align: 'left',
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
    field: (row) => row.comments,
  },
  {
    name: 'saleDate',
    required: true,
    label: 'Sale Date',
    align: 'left',
    field: (row) => moment(row.saleDate).format('YYYY-MM-DD'),
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
  { name: 'All Bills', statusId: null },
  { name: 'Completed', statusId: 1 },
  { name: 'Hold', statusId: 2 },
  { name: 'Canceled', statusId: 3 },
];
