import moment from 'moment';
import { QTableColumn } from 'quasar';
import {
  IGrnRecord,
  IGrnDetailsWithId,
  IPreviewGrnDetail,
} from 'src/interfaces';

export const GrnTableColumn: QTableColumn<IGrnRecord>[] = [
  {
    name: 'addedDate',
    required: true,
    label: 'Added Date',
    align: 'left',
    field: (row) => moment(row.addedDate).format('DD-MM-YYYY'),
  },
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
    label: 'Status',
    align: 'left',
    field: (row) => row.grnStatus,
  },
  {
    name: 'action',
    label: 'Action',
    align: 'left',
    field: () => '',
  },
];
export const selectedGrnInventoryTableColumn: QTableColumn<IGrnDetailsWithId>[] =
  [
    {
      name: 'productImage',
      label: 'Image',
      field: (row) => row.productImage,
      align: 'left',
    },
    {
      name: 'productName',
      label: 'Article',
      field: (row) => row.productName,
      align: 'left',
    },
    {
      name: 'productCode',
      label: 'Product Code',
      field: (row) => row.productCode?.split(',')[0] || '-',
      align: 'left',
    },
    {
      name: 'availableQuantity',
      label: 'Available Quantity',
      field: (row) => row.quantity,
      align: 'left',
    },
    {
      name: 'dispatchQuantity',
      label: 'Dispatch Quantity',
      field: (row) => row.quantity,
      align: 'left',
    },
    {
      name: 'retailPrice',
      label: 'Retail Price',
      field: (row) => row.retailPrice,
      align: 'left',
    },
    {
      name: 'action',
      label: 'Action',
      field: () => '',
      align: 'left',
    },
  ];

export const selectedBarcodeTableColumn: QTableColumn<IGrnDetailsWithId>[] = [
  {
    name: 'productImage',
    label: 'Image',
    field: (row) => row.productImage,
    align: 'left',
  },
  {
    name: 'productName',
    label: 'Article',
    field: (row) => row.productName,
    align: 'left',
  },
  {
    name: 'productCode',
    label: 'Product Code',
    field: (row) => row.productCode?.split(',')[0] || '-',
    align: 'left',
  },

  {
    name: 'quantity',
    label: 'Quantity',
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

export const PreviewGrnTableColumn: QTableColumn<IPreviewGrnDetail>[] = [
  {
    name: 'productImage',
    label: 'Image',
    field: (row) => row.productImage,
    align: 'left',
  },
  {
    name: 'productName',
    label: 'Article',
    field: (row) => row.productName,
    align: 'left',
  },
  {
    name: 'productCode',
    label: 'Product Code',
    field: (row) => row.productCode.split(',')[0],
    align: 'left',
  },
  {
    name: 'quantity',
    label: 'Quantity',
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
