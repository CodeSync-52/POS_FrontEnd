import { QTableColumn } from 'quasar';
import { IVariantData, IVariantDetailsData } from 'src/interfaces';

export const variantColumn: QTableColumn<IVariantData>[] = [
  {
    name: 'name',
    required: true,
    label: 'Group Name',
    align: 'left',
    field: (row) => row.name,
  },
  {
    name: 'variant',
    required: true,
    label: 'Variant',
    align: 'left',
    field: (row) => row.variant,
  },
  {
    name: 'status',
    align: 'left',
    label: 'Status',
    field: (row) => row.status,
  },
  { name: 'action', label: 'Action', field: () => '', align: 'left' },
];
export const variantDetailsColumn: QTableColumn<IVariantDetailsData>[] = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    sortable: true,
    field: (row) => row.name,
  },
  {
    name: 'displayName',
    required: true,
    label: 'Display Name',
    align: 'left',
    sortable: true,
    field: (row) => row.displayName,
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'left',
  },
  { name: 'action', label: 'Action', field: () => '', align: 'left' },
];
