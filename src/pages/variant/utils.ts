import { QTableColumn } from 'quasar';
import { IVariantData } from 'src/interfaces';

export const variantColumn: QTableColumn<IVariantData>[] = [
  {
    name: 'group',
    required: true,
    label: 'group',
    align: 'left',
    sortable: true,
    field: (row) => row.group,
  },
  {
    name: 'variant',
    required: true,
    label: 'variant',
    align: 'center',
    field: (row) => row.variant,
  },
  {
    name: 'status',
    align: 'center',
    label: 'status',
    sortable: true,
    field: (row) => row.status,
  },
  { name: 'action', label: 'Action', field: 'action', align: 'left' },
];

export const variantRows: IVariantData[] = [
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
