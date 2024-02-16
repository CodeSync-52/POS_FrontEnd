import moment from 'moment';
import { QTableColumn } from 'quasar';
import { IShopAccountReport } from 'src/interfaces';
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
