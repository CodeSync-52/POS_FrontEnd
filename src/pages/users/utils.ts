import { QTableColumn } from 'quasar';
import { IUserResponse } from 'src/interfaces';
export const UserColumn: QTableColumn<IUserResponse>[] = [
  {
    name: 'fullname',
    required: true,
    label: 'Fullname',
    align: 'left',
    field: (row) => row.fullName,
  },
  {
    name: 'userName',
    required: true,
    align: 'left',
    label: 'Username',
    field: (row) => row.userName,
  },
  {
    name: 'phone',
    align: 'left',
    label: 'Phone',
    field: (row) => row.phoneNumber,
  },
  {
    name: 'role',
    label: 'Role',
    field: (row) => row.roleName,
    align: 'left',
  },
  {
    name: 'customerGroup',
    label: 'User Category',
    field: (row) => row.customerGroup,
    align: 'left',
  },
  {
    name: 'shopName',
    label: 'Shop',
    field: (row) => row.shopName,
    align: 'left',
  },
  {
    name: 'discount',
    label: 'Disc.',
    field: (row) => row.discount,
    align: 'left',
  },
  {
    name: 'outStandingBalance',
    label: 'O/S Balance',
    field: (row) => row.outStandingBalance,
    align: 'left',
  },
  {
    name: 'isRetailDiscountAllowed',
    label: 'Retail Disc ?',
    field: (row) => row.isRetailDiscountAllowed,
    align: 'left',
  },
  {
    name: 'status',
    label: 'Status',
    field: (row) => row.status,
    align: 'left',
  },
  {
    name: 'action',
    label: 'Action',
    field: () => '',
    align: 'left',
  },
];
