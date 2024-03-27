import { QTableColumn } from 'quasar';
import { IShopResponse } from 'src/interfaces/shop-managment';
export const OrderBy = ['Ascending', 'Descending '];
export const shopNmaeOptions = ['Shop name1', 'Shop name2', 'Billed'];
export const shopStatusOptions = ['Active', 'InActive'];

export const shopColumn: QTableColumn<IShopResponse>[] = [
  {
    name: 'name',
    required: true,
    label: 'Shop Name',
    align: 'left',
    field: (row) => row.name,
  },
  {
    name: 'address',
    required: true,
    label: 'Shop Address',
    align: 'left',
    field: (row) => {
      const address = row.address || '';
      return address.length > 100 ? `${address.slice(0, 50)}...` : address;
    },
  },
  {
    name: 'phone',
    required: true,
    label: 'Phone Number',
    align: 'left',
    field: (row) => row.phone,
  },
  {
    name: 'code',
    required: true,
    label: 'Shop Code',
    align: 'left',
    field: (row) => row.code,
  },
  {
    name: 'status',
    required: true,
    label: 'Shop Status',
    align: 'left',
    field: (row) => row.status,
  },
  {
    name: 'isWareHouse',
    required: true,
    label: 'WareHouse',
    align: 'left',
    field: (row) => row.isWareHouse,
  },
  {
    name: 'action',
    required: true,
    label: 'Action',
    align: 'left',
    field: () => '',
  },
];

export const shopRows = [
  {
    shopId: 12456,
    name: 'ABC',
    address: 'Shop Id',
    code: 'NUMBER',
    closingBalance: 123,
    status: 'Active',
    isWareHouse: 'No',
    phone: '12345678',
  },
];
