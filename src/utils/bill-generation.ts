import moment from 'moment';
import { QTableColumn } from 'quasar';
import {
  IBillGenerationData,
  IBillGenerationDetailsInfoProductList,
  IProductInfoDetailList,
} from 'src/interfaces';

export const billGenerationColumn: QTableColumn<IBillGenerationData>[] = [
  {
    name: 'date',
    label: 'Date',
    align: 'left',
    field: (row) => moment(row.createdDate).format('DD-MM-YYYY'),
  },
  {
    name: 'user',
    required: true,
    label: 'User',
    align: 'left',
    field: (row) => row.name,
  },
  {
    name: 'totalAmount',
    label: 'Total Amount',
    align: 'left',
    field: (row) => row.totalAmount,
  },
  {
    name: 'recordStatus',
    label: 'Record Status',
    align: 'left',
    field: (row) => row.billStatus,
  },
  {
    name: 'action',
    label: 'Action',
    align: 'left',
    field: () => '',
  },
];
export const editBillGenerationRecordsColumn: QTableColumn<IProductInfoDetailList>[] =
  [
    {
      name: 'image',
      label: 'Image',
      align: 'left',
      field: (row) => row.image,
    },
    {
      name: 'article',
      label: 'Article',
      align: 'left',
      field: (row) => row.productName,
    },
    {
      name: 'quantity',
      label: 'Quantity',
      align: 'left',
      field: (row) => row.quantity,
    },
    {
      name: 'amount',
      label: 'Amount',
      align: 'left',
      field: (row) => row.amount,
    },
    {
      name: 'netTotal',
      label: 'Net Total',
      align: 'left',
      field: (row) => row.amount * row.quantity,
    },
  ];
export const BillGenerationDetailsInfoColumn: QTableColumn<IBillGenerationDetailsInfoProductList>[] =
  [
    {
      name: 'image',
      label: 'Image',
      align: 'left',
      field: (row) => row.image,
    },
    {
      name: 'article',
      label: 'Article',
      align: 'left',
      field: (row) => row.name,
    },
    {
      name: 'quantity',
      label: 'Quantity',
      align: 'left',
      field: (row) => row.quantity,
    },
    {
      name: 'amount',
      label: 'Amount',
      align: 'left',
      field: (row) => row.amount,
    },
    {
      name: 'netTotal',
      label: 'Net Total',
      align: 'left',
      field: (row) => row.amount * row.quantity,
    },
  ];
export const billStatusOptions = ['Completed', 'Cancelled', 'Draft'];
