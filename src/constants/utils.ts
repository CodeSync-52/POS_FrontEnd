import { EUserRoles, getRoleDisplayName } from 'src/interfaces';

export const roleOptions = Object.values(EUserRoles).map((role) => ({
  label: getRoleDisplayName(role),
  value: role,
}));

export const statusOptions = [
  { label: 'Active', value: 'Active' },
  { label: 'In Active', value: 'InActive' },
];
