import { IUserRole } from 'src/interfaces/roles/roles';

export const rolesMock: IUserRole[] = [
  {
    id: 1,
    name: 'Super Admin',
    action: 'edit',
    roles: [
      {
        id: 1,
        role: 'User Management',
        view: true,
        create: true,
        edit: true,
        delete: true,
      },
      {
        id: 2,
        role: 'Role Management',
        view: true,
        create: true,
        edit: true,
        delete: false,
      },
      {
        id: 3,
        role: 'Customer Management',
        view: true,
        create: true,
        edit: true,
        delete: false,
      },
      {
        id: 4,
        role: 'Receipt Management',
        view: true,
        create: true,
        edit: false,
        delete: false,
      },
      {
        id: 5,
        role: 'Bill Generation',
        view: true,
        create: false,
        edit: true,
        delete: false,
      },
      {
        id: 6,
        role: 'Cash in/Cash out',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 7,
        role: 'Sales Management',
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 8,
        role: 'Sales Return Management',
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 9,
        role: 'Shop Discount',
        view: true,
        create: false,
        edit: false,
        delete: true,
      },
      {
        id: 10,
        role: 'Variant Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 11,
        role: 'Category Management',
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 12,
        role: 'Article Management',
        view: true,
        create: false,
        edit: true,
        delete: false,
      },
      {
        id: 13,
        role: 'Inventory Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 14,
        role: 'Shop Management',
        view: true,
        create: false,
        edit: false,
        delete: true,
      },
      {
        id: 15,
        role: 'GRN',
        view: true,
        create: true,
        edit: false,
        delete: true,
      },
      {
        id: 16,
        role: 'STR',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 17,
        role: 'Report Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
    ],
  },
  {
    id: 2,
    name: 'Admin',
    action: 'edit',
    roles: [
      {
        id: 1,
        role: 'User Management',
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 2,
        role: 'Role Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 3,
        role: 'Customer Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 4,
        role: 'Receipt Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 5,
        role: 'Bill Generation',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 6,
        role: 'Cash in/Cash out',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 7,
        role: 'Sales Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 8,
        role: 'Sales Return Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 9,
        role: 'Shop Discount',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 10,
        role: 'Variant Management',
        view: false,
        create: true,
        edit: false,
        delete: false,
      },
      {
        id: 11,
        role: 'Category Management',
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 12,
        role: 'Article Management',
        view: true,
        create: false,
        edit: true,
        delete: false,
      },
      {
        id: 13,
        role: 'Inventory Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 14,
        role: 'Shop Management',
        view: true,
        create: false,
        edit: false,
        delete: true,
      },
      {
        id: 15,
        role: 'GRN',
        view: true,
        create: true,
        edit: false,
        delete: true,
      },
      {
        id: 16,
        role: 'STR',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 17,
        role: 'Report Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
    ],
  },
  {
    id: 3,
    name: 'Shop Manager',
    action: 'edit',
    roles: [
      {
        id: 1,
        role: 'User Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 2,
        role: 'Role Management',
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 3,
        role: 'Customer Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 4,
        role: 'Receipt Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 5,
        role: 'Bill Generation',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 6,
        role: 'Cash in/Cash out',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 7,
        role: 'Sales Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 8,
        role: 'Sales Return Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 9,
        role: 'Shop Discount',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 10,
        role: 'Variant Management',
        view: false,
        create: true,
        edit: false,
        delete: false,
      },
      {
        id: 11,
        role: 'Category Management',
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 12,
        role: 'Article Management',
        view: true,
        create: false,
        edit: true,
        delete: false,
      },
      {
        id: 13,
        role: 'Inventory Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 14,
        role: 'Shop Management',
        view: true,
        create: false,
        edit: false,
        delete: true,
      },
      {
        id: 15,
        role: 'GRN',
        view: true,
        create: true,
        edit: false,
        delete: true,
      },
      {
        id: 16,
        role: 'STR',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 17,
        role: 'Report Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
    ],
  },
  {
    id: 4,
    name: 'Office Boy',
    action: 'edit',
    roles: [
      {
        id: 1,
        role: 'User Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 2,
        role: 'Role Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 3,
        role: 'Customer Management',
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 4,
        role: 'Receipt Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 5,
        role: 'Bill Generation',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 6,
        role: 'Cash in/Cash out',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 7,
        role: 'Sales Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 8,
        role: 'Sales Return Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 9,
        role: 'Shop Discount',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 10,
        role: 'Variant Management',
        view: false,
        create: true,
        edit: false,
        delete: false,
      },
      {
        id: 11,
        role: 'Category Management',
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 12,
        role: 'Article Management',
        view: true,
        create: false,
        edit: true,
        delete: false,
      },
      {
        id: 13,
        role: 'Inventory Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 14,
        role: 'Shop Management',
        view: true,
        create: false,
        edit: false,
        delete: true,
      },
      {
        id: 15,
        role: 'GRN',
        view: true,
        create: true,
        edit: false,
        delete: true,
      },
      {
        id: 16,
        role: 'STR',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 17,
        role: 'Report Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
    ],
  },
  {
    id: 5,
    name: 'Shop Sale Officer',
    action: 'edit',
    roles: [
      {
        id: 1,
        role: 'User Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 2,
        role: 'Role Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 3,
        role: 'Customer Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 4,
        role: 'Receipt Management',
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 5,
        role: 'Bill Generation',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 6,
        role: 'Cash in/Cash out',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 7,
        role: 'Sales Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 8,
        role: 'Sales Return Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 9,
        role: 'Shop Discount',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 10,
        role: 'Variant Management',
        view: false,
        create: true,
        edit: false,
        delete: false,
      },
      {
        id: 11,
        role: 'Category Management',
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 12,
        role: 'Article Management',
        view: true,
        create: false,
        edit: true,
        delete: false,
      },
      {
        id: 13,
        role: 'Inventory Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 14,
        role: 'Shop Management',
        view: true,
        create: false,
        edit: false,
        delete: true,
      },
      {
        id: 15,
        role: 'GRN',
        view: true,
        create: true,
        edit: false,
        delete: true,
      },
      {
        id: 16,
        role: 'STR',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 17,
        role: 'Report Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
    ],
  },
  {
    id: 6,
    name: 'Customer/Vendor',
    action: 'edit',
    roles: [
      {
        id: 1,
        role: 'User Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 2,
        role: 'Role Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 3,
        role: 'Customer Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 4,
        role: 'Receipt Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 5,
        role: 'Bill Generation',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 6,
        role: 'Cash in/Cash out',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 7,
        role: 'Sales Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 8,
        role: 'Sales Return Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 9,
        role: 'Shop Discount',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 10,
        role: 'Variant Management',
        view: false,
        create: true,
        edit: false,
        delete: false,
      },
      {
        id: 11,
        role: 'Category Management',
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 12,
        role: 'Article Management',
        view: true,
        create: false,
        edit: true,
        delete: false,
      },
      {
        id: 13,
        role: 'Inventory Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 14,
        role: 'Shop Management',
        view: true,
        create: false,
        edit: false,
        delete: true,
      },
      {
        id: 15,
        role: 'GRN',
        view: true,
        create: true,
        edit: false,
        delete: true,
      },
      {
        id: 16,
        role: 'STR',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      {
        id: 17,
        role: 'Report Management',
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
    ],
  },
];