import { QTableColumn } from 'quasar';
import { IVariantDetailsData } from 'src/interfaces';

export const variantDetails: QTableColumn<IVariantDetailsData>[] = [
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
];
