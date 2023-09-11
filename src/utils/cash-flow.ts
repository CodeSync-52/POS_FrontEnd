import moment from 'moment';
import { QTableColumn } from 'quasar';
import { ICashFlowRecords } from 'src/interfaces';

export const cashFlowColumn: QTableColumn<ICashFlowRecords>[] = [
  {
    name: 'sourceId',
    label: 'Source Id',
    required: true,
    align: 'left',
    field: (row) => row.sourceUserId,
  },
  {
    name: 'targetId',
    label: 'Target Id',
    align: 'left',
    field: (row) => row.targetUserId,
  },
  {
    name: 'sourceUserName',
    label: 'Source User Name',
    align: 'left',
    field: (row) => row.sourceUserName,
  },
  {
    name: 'targetUserName',
    label: 'Target User Name',
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
    field: (row) => moment(row.transactionDate).format('Do MMM YYYY'),
  },
  {
    name: 'action',
    label: 'Action',
    align: 'left',
    field: () => '',
  },
];
