import { QTableColumn } from 'quasar';
import {
  IReceiptData,
  ISelectedArticleData,
} from 'src/interfaces/receipt-management';

export const receiptColumn: QTableColumn<IReceiptData>[] = [
  {
    name: 'userid',
    required: true,
    label: 'User Id',
    align: 'left',
    sortable: true,
    field: (row) => row.userId,
  },
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
    field: (row) => row.createdDate,
  },
  {
    name: 'action',
    required: true,
    label: 'Action',
    align: 'left',
    field: (row) => row.action,
  },
];
export const selectedArticleColumn: QTableColumn<ISelectedArticleData>[] = [
  {
    name: 'articleid',
    required: true,
    label: 'Id',
    align: 'left',
    sortable: true,
    field: (row) => row.articleId,
  },
  {
    name: 'article',
    required: true,
    label: 'Article',
    align: 'left',
    field: (row) => row.article,
  },
  {
    name: 'quantity',
    required: true,
    label: 'Quantity',
    align: 'left',
    field: (row) => row.quantity,
  },
];