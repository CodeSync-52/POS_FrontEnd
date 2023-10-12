import moment from 'moment';
import { QTableColumn } from 'quasar';
import { IInventoryListResponse } from 'src/interfaces';
export const InventoryListColumn: QTableColumn<IInventoryListResponse>[] = [
  {
    name: 'productId',
    required: true,
    label: 'Product Id',
    align: 'left',
    field: (row) => row.productId,
  },
  {
    name: 'productName',
    label: 'Product Name',
    align: 'left',
    field: (row) => row.productName,
  },
  {
    name: 'productImage',
    label: 'Product Image',
    align: 'left',
    field: (row) => row.productImage,
  },
  {
    name: 'productLabel',
    label: 'Product Label',
    align: 'left',
    field: (row) => row.productLabel,
  },
  {
    name: 'quantity',
    label: 'Quantity',
    align: 'left',
    field: (row) => row.quantity,
  },
  {
    name: 'variantId_1',
    label: 'First Variant',
    align: 'left',
    field: (row) => row.variantId_1,
  },
  {
    name: 'variantId_2',
    label: 'Second Variant',
    align: 'left',
    field: (row) => row.variantId_2,
  },
  {
    name: 'addedDate',
    label: 'Added Date',
    align: 'left',
    field: (row) => moment(row.addedDate).format('DD-MM-YYYY'),
  },
];
