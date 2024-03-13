import { QTableColumn } from 'quasar';
import { IUserResponse } from 'src/interfaces';
export const UserColumn: QTableColumn<IUserResponse>[] = [
  {
    name: 'fullname',
    required: true,
    label: 'Full name',
    align: 'left',
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
    label: 'Customer Group',
    field: (row) => row.customerGroup,
    align: 'left',
  },
  {
    name: 'shopName',
    label: 'Shop Name',
    field: (row) => row.shopName,
    align: 'left',
  },
  {
    name: 'status',
    label: 'Status',
    field: (row) => row.status,
    align: 'left',
  },
  {
    name: 'address',
    label: 'Address',
    field: (row) => row.address,
    align: 'left',
  },
  {
    name: 'discount',
    label: 'Discount',
    field: (row) => row.discount,
    align: 'left',
  },
  {
    name: 'outStandingBalance',
    label: 'Outstanding Balance',
    field: (row) => row.outStandingBalance,
    align: 'left',
  },
  {
    name: 'reset',
    label: 'Reset Password',
    field: () => '',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Action',
    field: () => '',
    align: 'left',
  },
];
