import { QTableColumn } from 'quasar';
import { IInventoryListResponse } from 'src/interfaces';
export const InventoryListColumn: QTableColumn<IInventoryListResponse>[] = [

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
    field: (row) => row.productCode.split(',')[0] || '-',
  },
  {
    name: 'retailPrice',
    required: true,
    label: 'Retail Price',
    align: 'left',
    field: (row) => row.retailPrice,
  },
  {
    name: 'quantity',
    label: 'Available Quantity',
    align: 'left',
    field: (row) => row.quantity,
  },
];
