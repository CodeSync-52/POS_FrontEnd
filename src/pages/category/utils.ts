import { QTableColumn } from 'quasar';
import { ICategoryData, ICategoryDetailsData } from 'src/interfaces';

export const categoryColumn: QTableColumn<ICategoryData>[] = [
  {
    name: 'group',
    required: true,
    label: 'Group',
    align: 'left',
    sortable: true,
    field: (row) => row.name,
  },
  {
    name: 'category',
    required: true,
    label: 'Category',
    align: 'left',
    field: (row) => row.categoryId,
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
export const categoryDetailsColumn: QTableColumn<ICategoryDetailsData>[] = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    sortable: true,
    field: (row) => row.name,
  },
  {
    name: 'status',
    required: true,
    label: 'Status',
    align: 'left',
    sortable: true,
    field: (row) => row.status,
  },
  { name: 'action', label: 'Action', field: 'action', align: 'left' },
];
