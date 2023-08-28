import moment from 'moment';
import { QTableColumn } from 'quasar';
import {
  IBillGenerationData,
  IBillGenerationDetailsInfoProductList,
  IProductInfoDetailList,
} from 'src/interfaces';

export const billGenerationColumn: QTableColumn<IBillGenerationData>[] = [
  {
    name: 'billid',
    required: true,
    label: 'Bill Id',
    align: 'left',
    field: (row) => row.billId,
  },
  {
    name: 'userid',
    required: true,
    label: 'User Id',
    align: 'left',
    field: (row) => row.userId,
  },
  {
    name: 'name',
    required: true,
    label: 'Name',
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
    name: 'date',
    label: 'Date',
    align: 'left',
    field: (row) => moment(row.createdDate).format('Do MMMM YYYY'),
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
    field: (row) => row.action,
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
      name: 'name',
      label: 'Name',
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
      name: 'name',
      label: 'Name',
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
