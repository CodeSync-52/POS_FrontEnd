import { EUserRoles, getRoleDisplayName } from 'src/interfaces';

export const customerGroupOptions = [
  { value: 1, label: 'Group 1' },
  { value: 2, label: 'Group 2' },
  { value: 3, label: 'Group 3' },
  { value: 4, label: 'Group 4' },
  { value: 5, label: 'Group 5' },
  { value: 6, label: 'Group 6' },
  { value: 7, label: 'Group 7' },
];

export const roleOptions = Object.values(EUserRoles).map((role) => ({
  label: getRoleDisplayName(role),
  value: role,
}));

export const statusOptions = [
  { label: 'Active', value: 'Active' },
  { label: 'In Active', value: 'InActive' },
];
