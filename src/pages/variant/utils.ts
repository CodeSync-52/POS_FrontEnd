import { QTableColumn } from 'quasar';
import { IVariantData, IVariantDetailsData } from 'src/interfaces';

export const variantColumn: QTableColumn<IVariantData>[] = [
  {
    name: 'group',
    required: true,
    label: 'Group',
    align: 'left',
    sortable: true,
    field: (row) => row.group,
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
    sortable: true,
    field: (row) => row.status,
  },
  { name: 'action', label: 'Action', field: 'action', align: 'left' },
];

export const variantRows: IVariantData[] = [
  {
    group: 'Size',
    id: '1',
    variant: 'Manage',
    status: 'Active',
    action: 'edit',
  },
  {
    group: 'Color',
    id: '2',
    variant: 'Manage',
    status: 'Active',
    action: 'edit',
  },
];
export const variantDetailsColumn: QTableColumn<IVariantDetailsData>[] = [
  {
    name: 'label',
    required: true,
    label: 'Label',
    align: 'left',
    sortable: true,
    field: (row) => row.label,
  },
  {
    name: 'fullName',
    required: true,
    label: 'Full Name',
    align: 'left',
    sortable: true,
    field: (row) => row.fullName,
  },
  { name: 'action', label: 'Action', field: 'action', align: 'left' },
];
export const variantDetailsData: IVariantDetailsData[] = [
  {
    id: '1',
    label: 'Xs',
    fullName: 'Extra Small',
    action: 'edit',
  },
  {
    id: '2',
    label: 'Sm',
    fullName: 'Small',
    action: 'edit',
  },
  {
    id: '3',
    label: 'Md',
    fullName: 'Medium',
    action: 'edit',
  },
  {
    id: '4',
    label: 'Lg',
    fullName: 'Large',
    action: 'edit',
  },
  {
    id: '5',
    label: 'Xl',
    fullName: 'Extra large',
    action: 'edit',
  },
];
