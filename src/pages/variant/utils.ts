export const variantColumn = [
  {
    name: 'group',
    required: true,
    label: 'group',
    align: 'left',
    sortable: true,
  },
  {
    name: 'variant',
    required: true,
    label: 'variant',
    align: 'center',
  },
  {
    name: 'status',
    align: 'center',
    label: 'status',
    sortable: true,
  },
  { name: 'action', label: 'Action', field: 'action', align: 'left' },
];

export const variantRows = [
  {
    group: 'Size',
    variant: 'Manage',
    status: 'Active',
    action: 'edit',
  },
  {
    group: 'Color',
    variant: 'Manage',
    status: 'Active',
    action: 'edit',
  },
];
