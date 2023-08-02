import { IUserData } from 'src/interfaces';

export const customerGroupOptions = [
  { value: 1, label: 'Group 1' },
  { value: 2, label: 'Group 2' },
  { value: 3, label: 'Group 3' },
  { value: 4, label: 'Group 4' },
  { value: 5, label: 'Group 5' },
  { value: 6, label: 'Group 6' },
  { value: 7, label: 'Group 7' },
];

export const roleOptions = [
  { label: 'Super Admin', value: 'supper_admin' },
  { label: 'Admin', value: 'admin' },
  { label: 'Shop Manager', value: 'shop_manager' },
  { label: 'Office Boy', value: 'office_boy' },
  { label: 'Shop Sale Officer', value: 'shop_sale_officer' },
  { label: 'Customer/Vendor', value: 'customer_vendor' },
];

export const statusOptions = [
  { label: 'All', value: -1 },
  { label: 'Active', value: 1 },
  { label: 'In Active', value: 0 },
];

export const addUserDefaultState: IUserData = {
  fullName: '',
  userName: '',
  phoneNumber: '',
  outStandingBalance: 0,
  wholeSaleDiscount: 0,
  isActive: true,
  password: '12345678',
  isPhnNumberAsUserNumber: false,
};
