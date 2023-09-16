import { QTableColumn } from 'quasar';
import {
  IReceiptData,
  ISelectedArticleData,
} from 'src/interfaces/receipt-management';
import moment from 'moment';
export const purchaseStatusOptions = ['Open', 'Cancelled', 'Billed'];
export const receiptColumn: QTableColumn<IReceiptData>[] = [
  {
    name: 'purchaseId',
    required: true,
    label: 'Purchase Id',
    align: 'left',
    sortable: true,
    field: (row) => row.purchaseId,
  },
  // {
  //   name: 'userid',
  //   required: true,
  //   label: 'User Id',
  //   align: 'left',
  //   sortable: true,
  //   field: (row) => row.userId,
  // },
  {
    name: 'fullName',
    required: true,
    label: 'Full Name',
    align: 'left',
    sortable: true,
    field: (row) => row.fullName,
  },
  {
    name: 'totalquantity',
    required: true,
    label: 'Total Quantity',
    align: 'left',
    field: (row) => row.totalQuantity,
  },
  {
    name: 'purchaseStatus',
    required: true,
    label: 'Purchase Status',
    align: 'left',
    field: (row) => row.purchaseStatus,
  },
  {
    name: 'createdDate',
    required: true,
    label: 'Created Date',
    align: 'left',
    field: (row) => moment(row.createdDate).format('DD-MM-YYYY'),
  },
  {
    name: 'action',
    required: true,
    label: 'Action',
    align: 'left',
    field: () => '',
  },
];
export const selectedArticleColumn: QTableColumn<ISelectedArticleData>[] = [
  {
    name: 'productId',
    required: true,
    label: 'Id',
    align: 'left',
    sortable: true,
    field: (row) => row.productId,
  },
  {
    name: 'image',
    required: true,
    label: 'Article Image',
    align: 'left',
    field: (row) => row.productImage,
  },
  {
    name: 'name',
    required: true,
    label: 'Article Name',
    align: 'left',
    field: (row) => row.productName,
  },
  {
    name: 'quantity',
    required: true,
    label: 'Quantity',
    align: 'left',
    field: (row) => row.quantity,
  },
  {
    name: 'action',
    label: 'Action',
    field: () => '',
    align: 'left',
  },
];
