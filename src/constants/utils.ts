import { EUserRoles } from 'src/interfaces';

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
  { label: 'Super Admin', value: EUserRoles.SuperAdmin },
  { label: 'Admin', value: EUserRoles.Admin },
  { label: 'Shop Manager', value: EUserRoles.ShopManager },
  { label: 'Office Boy', value: EUserRoles.OfficeManager },
  { label: 'Shop Sale Officer', value: EUserRoles.ShopOfficer },
  { label: 'Customer/Vendor', value: EUserRoles.Customer },
];

export const statusOptions = [
  { label: 'All', value: -1 },
  { label: 'Active', value: 1 },
  { label: 'In Active', value: 0 },
];
