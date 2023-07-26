export const customerGroup = [
  { value: 1, label: 'Group 1' },
  { value: 2, label: 'Group 2' },
  { value: 3, label: 'Group 3' },
  { value: 4, label: 'Group 4' },
  { value: 5, label: 'Group 5' },
  { value: 6, label: 'Group 6' },
  { value: 7, label: 'Group 7' },
];

export const role = [
  { label: 'Super Admin', value: 'supper_admin' },
  { label: 'Admin', value: 'admin' },
  { label: 'Shop Manager', value: 'shop_manager' },
  { label: 'Office Boy', value: 'office_boy' },
  { label: 'Shop Sale Officer', value: 'shop_sale_officer' },
  { label: 'Customer/Vendor', value: 'customer_vendor' },
];

export const status = [
  { label: 'All', value: -1 },
  { label: 'Active', value: 1 },
  { label: 'In Active', value: 0 },
];
export const statusFilter = {
  label: null,
  value: null,
};
export const roleFilter = {
  label: null,
  value: null,
};
export const customerGroupFilter = {
  label: null,
  value: null,
};
export const userManagementFilter = {
  customerGroup: customerGroupFilter,
  role: roleFilter,
  status: statusFilter,
};

export const addUserStateManagement = {
  fullName: '',
  userName: '',
  phone: '',
  role: '',
  assignShop: '',
  outStandingBalance: 0,
  wholeSaleDiscount: 0,
  isActive: true,
  password: '12345678',
  customerGroup: '',
  isPhnNumberAsUserNumber: false,
};
