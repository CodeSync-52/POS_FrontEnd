import moment from 'moment';
import { QTableColumn } from 'quasar';
import { ICashFlowRecords } from 'src/interfaces';

export const cashFlowColumn: QTableColumn<ICashFlowRecords>[] = [
  {
    name: 'sourceUserName',
    label: 'Receiver',
    align: 'left',
    field: (row) => row.sourceUserName,
  },
  {
    name: 'targetUserName',
    label: 'Sender',
    align: 'left',
    field: (row) => row.targetUserName,
  },
  {
    name: 'cashFlowStatus',
    label: 'Cash Flow Status',
    align: 'left',
    field: (row) => row.cashFlowStatus,
  },
  {
    name: 'amount',
    label: 'Amount',
    align: 'left',
    field: (row) => row.amount,
  },
  {
    name: 'comments',
    label: 'Comments',
    align: 'left',
    field: (row) => row.comments,
  },
  {
    name: 'date',
    label: 'Date',
    align: 'left',
    field: (row) => moment(row.transactionDate).format('DD-MM-YYYY'),
  },
  {
    name: 'action',
    label: 'Action',
    align: 'left',
    field: () => '',
  },
];
