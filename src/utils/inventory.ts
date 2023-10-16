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
    name: 'productCode',
    label: 'Product Code',
    align: 'left',
    field: (row) => row.productCode,
  },
  {
    name: 'quantity',
    label: 'Quantity',
    align: 'left',
    field: (row) => row.quantity,
  },
  {
    name: 'addedDate',
    label: 'Added Date',
    align: 'left',
    field: (row) => moment(row.addedDate).format('DD-MM-YYYY'),
  },
];
