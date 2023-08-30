import { IArticleCategory } from 'src/interfaces';
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
