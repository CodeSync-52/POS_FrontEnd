import moment from 'moment';
import { QTableColumn } from 'quasar';
import { IGrnRecords, IGrnDetailsWithId } from 'src/interfaces';

export const GrnTableColumn: QTableColumn<IGrnRecords>[] = [
  {
    name: 'fromShop',
    required: true,
    label: 'From Shop',
    align: 'left',
    field: (row) => row.fromShopName,
  },
  {
    name: 'toShop',
    label: 'To Shop',
    field: (row) => row.toShopName,
    align: 'left',
    sortable: false,
  },
  {
    name: 'quantity',
    required: true,
    label: 'Quantity',
    align: 'left',
    field: (row) => row.quantity,
  },
  {
    name: 'grnStatus',
    required: true,
    label: 'Grn Status',
    align: 'left',
    field: (row) => row.grnStatus,
  },
  {
    name: 'addedDate',
    required: true,
    label: 'Added Date',
    align: 'left',
    field: (row) => moment(row.addedDate).format('DD-MM-YYYY'),
  },
];
export const PreviewGrnTableColumn: QTableColumn<IGrnDetailsWithId>[] = [
  {
    name: 'productImage',
    label: 'Product Image',
    field: (row) => row.productImage,
    align: 'left',
  },
  {
    name: 'productName',
    label: 'Product Name',
    field: (row) => row.productName,
    align: 'left',
  },
  {
    name: 'dispatchedQuantity',
    label: 'Dispatched Quantity',
    field: (row) => row.quantity,
    align: 'left',
  },
  {
    name: 'action',
    label: 'Action',
    field: () => '',
    align: 'left',
  },
];
