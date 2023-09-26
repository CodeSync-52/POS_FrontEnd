import { QTableColumn } from 'quasar';
import { IShopData } from 'src/interfaces/shop-managment';
export const shopMangerOptions = ['Shop Manager', 'Shop Keeper', 'Billed'];
export const shopNmaeOptions = ['Shop name1', 'Shop name2', 'Billed'];
export const shopNumberOptions = ['Shop Number', 'Shop Number2', 'Billed'];

export const shopColumn: QTableColumn<IShopData>[] = [
  {
    name: 'ShopId',
    required: true,
    label: 'Shop Id',
    align: 'left',
    sortable: true,
    field: (row) => row.ShopId,
  },
  {
    name: 'shopName',
    required: true,
    label: 'Shop Name',
    align: 'left',
    sortable: true,
    field: (row) => row.shopName,
  },
  {
    name: 'shopAddress',
    required: true,
    label: 'Shop Address',
    align: 'left',
    field: (row) => row.shopAddress,
  },
  {
    name: 'shopcode',
    required: true,
    label: 'Shop Code',
    align: 'left',
    field: (row) => row.shopcode,
  },
  {
    name: 'closingBalance',
    required: true,
    label: 'Created Date',
    align: 'left',
    field: (row) => row.closingBalance,
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
    ShopId: 12456,
    shopName: 'ABC',
    shopAddress: 'Shop Id',
    shopcode: 'NUMBER',
    closingBalance: '123',
    action: 'EDIT DELETE',
  },
];
