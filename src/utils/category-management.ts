import {
  ICategoryData,
  ICategoryDetailsData,
  IArticleCategory,
} from 'src/interfaces';
import { QTableColumn } from 'quasar';

export const categoryTreeColumn: QTableColumn<IArticleCategory>[] = [
  {
    name: 'name',
    label: 'Name',
    required: true,
    field: (row) => row.name,
    align: 'left',
    sortable: true,
  },
];
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
  { name: 'action', label: 'Action', field: () => '', align: 'left' },
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
  { name: 'action', label: 'Action', field: () => '', align: 'left' },
];
