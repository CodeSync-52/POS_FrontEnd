import { QTableColumn } from 'quasar';
import { IBillGenerationData, IProductReceipt } from 'src/interfaces';

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
    field: (row) => row.date,
  },
  {
    name: 'recordStatus',
    label: 'Record Status',
    align: 'left',
    field: (row) => row.recordStatus,
  },
  {
    name: 'action',
    label: 'Action',
    align: 'left',
    field: (row) => row.action,
  },
];
export const editBillGenerationRecordsColumn: QTableColumn<IProductReceipt>[] =
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
      label: 'amount',
      align: 'left',
      field: (row) => row.amount,
    },
    {
      name: 'netTotal',
      label: 'Net Total',
      align: 'left',
      field: (row) => row.netTotal,
    },
  ];
export const billGenerationRecords: IBillGenerationData[] = [
  {
    billId: 1,
    userId: 1,
    name: 'Shina',
    totalAmount: 100,
    date: '',
    recordStatus: 'Pending',
    productReceipt: [
      {
        image: 'string',
        name: 'string',
        quantity: 10,
        amount: 50,
      },
      {
        image: 'string2',
        name: 'string3',
        quantity: 20,
        amount: 60,
      },
    ],
  },
];
