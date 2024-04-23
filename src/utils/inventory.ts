import { QTableColumn } from 'quasar';
import { IInventoryListResponse } from 'src/interfaces';
export const InventoryListColumn: QTableColumn<IInventoryListResponse>[] = [
  {
    name: 'productName',
    label: 'Article',
    align: 'left',
    field: (row) => row.productName,
  },
  {
    name: 'shop',
    label: 'Shop Name',
    align: 'left',
    field: (row) => row.shopName,
  },
  {
    name: 'productImage',
    label: 'Image',
    align: 'left',
    field: (row) => row.productImage,
  },
  {
    name: 'size',
    required: true,
    label: 'Size',
    align: 'left',
    field: (row) => row.size,
  },
  {
    name: 'color',
    required: true,
    label: 'Color',
    align: 'left',
    field: (row) => row.color,
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
export const InventoryBasicColumn: QTableColumn<IInventoryListResponse>[] = [
  {
    name: 'productName',
    label: 'Article',
    align: 'left',
    field: (row) => row.productName,
  },
  {
    name: 'shop',
    label: 'Shop',
    align: 'left',
    field: (row) => row.shopName,
  },

  {
    name: 'size',
    required: true,
    label: 'Size',
    align: 'left',
    field: (row) => row.size,
  },
  {
    name: 'color',
    required: true,
    label: 'Color',
    align: 'left',
    field: (row) => row.color,
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
