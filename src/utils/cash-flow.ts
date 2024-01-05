import moment from 'moment';
import { QTableColumn } from 'quasar';
import { ICashFlowRecords } from 'src/interfaces';

export const cashFlowColumn: QTableColumn<ICashFlowRecords>[] = [
  {
    name: 'sourceId',
    label: 'Cash In Id',
    required: true,
    align: 'left',
    field: (row) => row.sourceUserId,
  },
  {
    name: 'targetId',
    label: 'Cash Out Id',
    align: 'left',
    field: (row) => row.targetUserId,
  },
  {
    name: 'sourceUserName',
    label: 'Cash In User Name',
    align: 'left',
    field: (row) => row.sourceUserName,
  },
  {
    name: 'targetUserName',
    label: 'Cash Out User Name',
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
