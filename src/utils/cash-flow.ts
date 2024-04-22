import moment from 'moment';
import { QTableColumn } from 'quasar';
import { ICashFlowRecords } from 'src/interfaces';

export const cashFlowColumn: QTableColumn<ICashFlowRecords>[] = [
  {
    name: 'date',
    label: 'Date',
    align: 'left',
    field: (row) => moment(row.transactionDate).format('DD-MM-YYYY'),
  },
  {
    name: 'targetUserName',
    label: 'Sender',
    align: 'left',
    field: (row) => row.targetUserName,
  },
  {
    name: 'amount',
    label: 'Amount',
    align: 'left',
    field: (row) => row.amount,
  },
  {
    name: 'sourceUserName',
    label: 'Receiver',
    align: 'left',
    field: (row) => row.sourceUserName,
  },
  {
    name: 'cashFlowStatus',
    label: 'Status',
    align: 'left',
    field: (row) => row.cashFlowStatus,
  },
  {
    name: 'comments',
    label: 'Comments',
    align: 'left',
    field: (row) => row.comments,
  },
  {
    name: 'action',
    label: 'Action',
    align: 'left',
    field: () => '',
  },
];
