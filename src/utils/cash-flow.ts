import moment from 'moment';
import { QTableColumn } from 'quasar';
import { ICashFlowRecords } from 'src/interfaces';

export const cashFlowColumn: QTableColumn<ICashFlowRecords>[] = [
  {
    name: 'id',
    label: 'Id',
    required: true,
    align: 'left',
    field: (row) => row.id,
  },
  {
    name: 'source',
    label: 'Source',
    align: 'left',
    field: (row) => row.source,
  },
  {
    name: 'target',
    label: 'Target',
    align: 'left',
    field: (row) => row.target,
  },
  {
    name: 'date',
    label: 'Date',
    align: 'left',
    field: (row) => moment(row.date).format('DD-MM-YYYY'),
  },
  {
    name: 'amount',
    label: 'Amount',
    align: 'left',
    field: (row) => row.amount,
  },
];
export const cashFlowData: ICashFlowRecords[] = [
  {
    id: 1,
    source: 'LinkedIn',
    target: 'Facebook',
    amount: 1000,
    date: '2023-08-25 12:31:05.3591687',
  },
];
