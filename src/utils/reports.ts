import { QTableColumn } from 'quasar';
import moment from 'moment';
import {
  IAccountReportData,
  IHOArticleReportData,
  IHOSaleDetailReportData,
  IHOStockReportData,
  IOutStandingReportData,
} from 'src/interfaces';
export const purchaseStatusOptions = ['Open', 'Cancelled', 'Billed'];
export const accountReportColumn: QTableColumn<IAccountReportData>[] = [
  {
    name: 'date',
    required: true,
    label: 'Date',
    align: 'left',
    field: (row) => moment(row.date).format('DD-MM-YYYY'),
  },
  {
    name: 'transactionDetail',
    required: true,
    label: 'Transaction Detail',
    align: 'left',
    field: (row) => row.transactionDetail,
  },
  {
    name: 'debit',
    required: true,
    label: 'Debit +',
    align: 'left',
    field: (row) => row.debit ?? '-',
  },
  {
    name: 'credit',
    required: true,
    label: 'Credit -',
    align: 'left',
    field: (row) => row.credit ?? '-',
  },
  {
    name: 'balance',
    required: true,
    label: 'Balance',
    align: 'left',
    field: (row) => row.balance ?? '-',
  },
];

export const outStandingReportColumn: QTableColumn<IOutStandingReportData>[] = [
  {
    name: 'user',
    required: true,
    label: 'User',
    align: 'left',
    field: (row) => row.user,
  },
  {
    name: 'balance',
    required: true,
    label: 'OutStanding Balance',
    align: 'left',
    field: (row) => row.balance ?? '-',
  },
  {
    name: 'phone',
    required: true,
    label: 'Phone Number',
    align: 'left',
    field: (row) => row.phone ?? '-',
  },
];

export const HOStockReportColumn: QTableColumn<IHOStockReportData>[] = [
  {
    name: 'productName',
    required: true,
    label: 'Product Name',
    align: 'left',
    field: (row) => row.productName,
  },
  {
    name: 'productImage',
    required: true,
    label: 'Image',
    align: 'left',
    field: (row) => row.productImage,
  },
  {
    name: 'masterStock',
    required: true,
    label: 'Master Stock',
    align: 'left',
    field: (row) => row.masterStock ?? '-',
  },
];

export const HOArticleReportColumn: QTableColumn<IHOArticleReportData>[] = [
  {
    name: 'product',
    required: true,
    label: 'Product',
    align: 'left',
    field: (row) => row.product,
  },
  {
    name: 'image',
    required: true,
    label: 'Image',
    align: 'left',
    field: (row) => row.image,
  },
  {
    name: 'quantity',
    required: true,
    label: 'Quantity',
    align: 'left',
    field: (row) => row.quantity ?? '-',
  },
  {
    name: 'amount',
    required: true,
    label: 'Amount',
    align: 'left',
    field: (row) => row.amount ?? '-',
  },
];

export const HOArticleSaleDetailReportColumn: QTableColumn<IHOSaleDetailReportData>[] =
  [
    {
      name: 'date',
      required: true,
      label: 'Date',
      align: 'left',
      field: (row) => moment(row.date).format('DD-MM-YYYY'),
    },
    {
      name: 'user',
      required: true,
      label: 'User',
      align: 'left',
      field: (row) => row.user,
    },
    {
      name: 'quantity',
      required: true,
      label: 'Quantity',
      align: 'left',
      field: (row) => row.quantity ?? '-',
    },
    {
      name: 'amount',
      required: true,
      label: 'Amount',
      align: 'left',
      field: (row) => row.amount ?? '-',
    },
  ];
