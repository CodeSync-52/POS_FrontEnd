import moment from 'moment';
import { QTableColumn } from 'quasar';
import {
  IShopAccountReport,
  IShopExpenses,
  InComingOutgoingToHo,
} from 'src/interfaces';
export const shopAccountReportTableColumn: QTableColumn<IShopAccountReport>[] =
  [
    {
      name: 'createdDate',
      label: 'Date',
      field: (row) => moment(row.createdDate).format('DD-MM-YYYY'),
      align: 'left',
    },
    {
      name: 'shopName',
      label: 'Shop',
      field: (row) => row.shopName,
      align: 'left',
    },
    {
      name: 'openingBalance',
      label: 'Opening Balance',
      field: (row) => row.openingBalance,
      align: 'left',
    },
    {
      name: 'totalSale',
      label: 'Total Sale',
      field: (row) => row.totalSale,
      align: 'left',
    },
    {
      name: 'totalDiscount',
      label: 'Total Discount',
      field: (row) => row.totalDiscount,
      align: 'left',
    },
    {
      name: 'totalExpense',
      label: 'Total Expense',
      field: (row) => row.totalExpense,
      align: 'left',
    },
    {
      name: 'totalIncomingFromHO',
      label: 'Incoming From HO',
      field: (row) => row.totalIncomingFromHO,
      align: 'left',
    },
    {
      name: 'totalOutgoingToHO',
      label: 'Outgoing To HO',
      field: (row) => row.totalOutgoingToHO,
      align: 'left',
    },
    {
      name: 'remainingBalance',
      label: 'Remaining Balance',
      field: (row) => row.remainingBalance,
      align: 'left',
    },

    {
      name: 'totalItemsSale',
      label: 'Sold Items',
      field: (row) => row.totalItemsSale,
      align: 'left',
    },
    {
      name: 'action',
      label: 'Action',
      field: () => '',
      align: 'left',
    },
  ];
export const shopExpenseTableColumn: QTableColumn<IShopExpenses>[] = [
  {
    name: 'expenseName',
    required: true,
    label: 'Expense Name',
    align: 'left',
    field: (row) => row.expenseName,
  },
  {
    name: 'amount',
    required: true,
    label: 'Amount',
    align: 'left',
    field: (row) => row.amount,
  },
  {
    name: 'comment',
    required: true,
    label: 'Comments',
    align: 'left',
    field: (row) => row.comment || '-',
  },
];
export const incomingOutgoingToHoTableColumn: QTableColumn<InComingOutgoingToHo>[] =
  [
    {
      name: 'userId',
      required: true,
      label: 'User Id',
      align: 'left',
      field: (row) => row.userId,
    },
    {
      name: 'userName',
      required: true,
      label: 'User Name',
      align: 'left',
      field: (row) => row.userName,
    },
    {
      name: 'amount',
      required: true,
      label: 'Amount',
      align: 'left',
      field: (row) => row.amount,
    },
    {
      name: 'comment',
      required: true,
      label: 'Comments',
      align: 'left',
      field: (row) => row.comment || '-',
    },
    {
      name: 'transactionDate',
      required: true,
      label: 'Transaction Date',
      align: 'left',
      field: (row) => moment(row.transactionDate).format('DD-MM-YYYY'),
    },
  ];
