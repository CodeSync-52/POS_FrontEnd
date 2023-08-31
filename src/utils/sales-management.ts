import { QTableColumn } from 'quasar';
import { ISalesManagementData } from 'src/interfaces';

export const salesManagementColumn: QTableColumn<ISalesManagementData>[] = [
  {
    name: 'wholesale',
    label: 'Wholesale Id',
    field: (row) => row.wholesaleId,
    align: 'left',
  },
  {
    name: 'userId',
    label: 'User Id',
    field: (row) => row.userId,
    align: 'left',
  },
  {
    name: 'fullName',
    label: 'Full Name',
    field: (row) => row.fullName,
    align: 'left',
  },
  {
    name: 'totalQuantity',
    label: 'Total Quantity',
    field: (row) => row.totalQuantity,
    align: 'left',
  },
  {
    name: 'wholesaleStatus',
    label: 'Wholesale Status',
    field: (row) => row.wholesaleStatus,
    align: 'left',
  },
  {
    name: 'totalAmount',
    label: 'Total Amount',
    field: (row) => row.totalAmount,
    align: 'left',
  },
  {
    name: 'discount',
    label: 'Discount',
    field: (row) => row.discount,
    align: 'left',
  },
  {
    name: 'netAmount',
    label: 'Net Amount',
    field: (row) => row.totalQuantity * row.totalAmount - row.discount,
    align: 'left',
  },
  {
    name: 'action',
    label: 'Action',
    field: () => '',
    align: 'left',
  },
];
export const salesManagementData: ISalesManagementData[] = [
  {
    wholesaleId: 1,
    userId: 1,
    fullName: 'darek',
    totalQuantity: 5,
    wholesaleStatus: 'Open',
    totalAmount: 100,
    discount: 10,
  },
  {
    wholesaleId: 2,
    userId: 2,
    fullName: 'mark',
    totalQuantity: 10,
    wholesaleStatus: 'Open',
    totalAmount: 50,
    discount: 12,
  },
];
