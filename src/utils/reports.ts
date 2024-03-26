import { QTableColumn } from 'quasar';
import moment from 'moment';
import { IAccountReportData, IOutStandingReportData } from 'src/interfaces';
export const purchaseStatusOptions = ['Open', 'Cancelled', 'Billed'];
export const accountReportColumn: QTableColumn<IAccountReportData>[] = [
  {
    name: 'date',
    required: true,
    label: 'Date',
    align: 'left',
    sortable: true,
    field: (row) => moment(row.date).format('DD-MM-YYYY'),
  },
  {
    name: 'transactionDetail',
    required: true,
    label: 'Transaction Detail',
    align: 'left',
    sortable: true,
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
    label: 'User Name',
    align: 'left',
    sortable: true,
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
