import { QTableColumn } from 'quasar';
import { IInventoryListResponse } from 'src/interfaces';
export const InventoryListColumn: QTableColumn<IInventoryListResponse>[] = [
  {
    name: 'shopid',
    required: true,
    label: 'Shop Id',
    align: 'left',
    field: (row) => row.shopId,
  },
  {
    name: 'totalProducts',
    label: 'Total Products',
    align: 'left',
    field: (row) => row.totalProducts,
  },
  {
    name: 'addedBy',
    label: 'Added By',
    align: 'left',
    field: (row) => row.addedBy,
  },
  {
    name: 'createdBy',
    label: 'Created By',
    align: 'left',
    field: (row) => row.createdBy,
  },
  {
    name: 'addedDate',
    label: 'Added Date',
    align: 'left',
    field: (row) => row.addedDate,
  },
];
