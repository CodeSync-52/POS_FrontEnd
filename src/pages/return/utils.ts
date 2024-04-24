import moment from 'moment';
import { QTableColumn } from 'quasar';
import {
  IGrnDetailsWithdiscount,
  IShopSaleExpenses,
  IBillStatusOptionList,
  ISaleInfo,
} from 'src/interfaces';
import { Ref } from 'vue';
export const buttons = [
  {
    label: 'Hold Sale',
    icon: 'hourglass_empty',
    shortcut: 'F3',
    name: 'holdBill',
  },
  {
    label: 'All Bills',
    icon: 'receipt',
    shortcut: 'F5',
    name: 'showAllBill',
  },
  {
    label: 'Hold Bills',
    icon: 'visibility',
    shortcut: 'F6',
    name: 'showHoldBill',
  },
  {
    label: 'Shop Closing',
    icon: 'trending_up',
    shortcut: 'F7',
    name: 'shopSummary',
  },
  {
    label: 'Closed Record',
    icon: 'account_balance_wallet',
    shortcut: 'F8',
    name: 'shopAccount',
  },
];
export const saleShopSelectedGrnInventoryTableColumn: QTableColumn<IGrnDetailsWithdiscount>[] =
  [
    {
      name: 'productImage',
      label: 'Image',
      field: (row) => row.productImage,
      align: 'left',
    },
    {
      name: 'productName',
      label: 'Name',
      field: (row) => row.productName,
      align: 'left',
    },
    {
      name: 'productCode',
      label: 'Code',
      field: (row) => row.productCode?.split(',')[0] || '-',
      align: 'left',
    },
    {
      name: 'availableQuantity',
      label: 'Avail.Qty',
      field: (row) => row.quantity,
      align: 'left',
    },
    {
      name: 'dispatchQuantity',
      label: 'Disp.Qty',
      field: (row) => row.quantity,
      align: 'left',
    },
    {
      name: 'retailPrice',
      label: 'Price',
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
    label: 'Image',
    field: (row) => row.productImage,
    align: 'left',
  },
  {
    name: 'productName',
    label: 'Article',
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
    label: 'Expense',
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
    name: 'saleDate',
    required: true,
    label: 'Date',
    align: 'left',
    field: (row) => moment(row.saleDate).format('YYYY-MM-DD'),
  },
  {
    name: 'status',
    required: true,
    label: 'Status',
    align: 'left',
    field: (row) => row.status,
  },
  {
    name: 'totalQuantity',
    required: true,
    label: 'Quantity',
    align: 'left',
    field: (row) => row.totalQuantity,
  },
  {
    name: 'totalDiscount',
    required: true,
    label: 'Discount',
    align: 'left',
    field: (row) => row.totalDiscount,
  },
  {
    name: 'netAmount',
    required: true,
    label: 'Amount',
    align: 'left',
    field: (row) => row.netAmount,
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

export const printReceipt = (ReceiptToPrint: Ref) => {
  const header_string =
    '<html><head><title>' + document.title + '</title></head><body>';
  const footer_string = '</body></html>';
  const new_string = ReceiptToPrint.value?.innerHTML;
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    const stylesheets =
      '<style>' + '.receipt {page-break-after:always}' + '</style>';
    printWindow.document.write(
      header_string + stylesheets + new_string + footer_string
    );
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  }
  return false;
};
