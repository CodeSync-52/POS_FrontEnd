import { QTableColumn } from 'quasar';
import { IUserTableData } from 'src/interfaces';
export const UserColumn: QTableColumn<IUserTableData>[] = [
  {
    name: 'fullname',
    required: true,
    label: 'Full name',
    align: 'left',
    sortable: true,
    field: (row) => row.fullName,
  },
  {
    name: 'userName',
    required: true,
    align: 'left',
    label: 'User Name',
    field: (row) => row.userName,
  },
  {
    name: 'phoneNumber',
    align: 'left',
    label: 'Phone Number',
    sortable: true,
    field: (row) => row.phoneNumber,
  },
  {
    name: 'role',
    label: 'Role',
    field: (row) => row.role,
    sortable: true,
    align: 'left',
  },
  {
    name: 'assignShop',
    label: 'Shop',
    field: (row) => row.assignShop,
    align: 'left',
  },
  {
    name: 'customerGroup',
    label: 'Customer Group',
    sortable: true,
    field: (row) => row.customerGroup,
    align: 'left',
  },
  {
    name: 'status',
    label: 'Status',
    field: (row) => row.status,
    align: 'left',
  },
  {
    name: 'discount',
    label: 'Discount',
    field: (row) => row.discount,
    sortable: true,
    align: 'left',
  },
  {
    name: 'outStandingBalance',
    label: 'Outstanding Balance',
    field: (row) => row.outStandingBalance,
    align: 'left',
  },
  {
    name: 'action',
    label: 'Action',
    field: (row) => row.action,
    align: 'center',
  },
];
