import moment from 'moment';
import { QTableColumn } from 'quasar';
import { IArticleData, IBillingHistoryResponse } from 'src/interfaces';

export const ArticleColumn: QTableColumn<IArticleData>[] = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: (row) => row.name,
  },
  {
    name: 'image',
    required: true,
    label: 'Image',
    align: 'left',
    field: (row) => row.productImage,
  },
  {
    name: 'category',
    required: true,
    label: 'Category',
    align: 'left',
    field: (row) => row.categoryName,
  },
  {
    name: 'wholeSalePrice',
    required: true,
    label: 'Wholesale Price',
    align: 'left',
    field: (row) => row.wholeSalePrice,
  },
  {
    name: 'retailrate',
    required: true,
    label: 'Retail Rate',
    align: 'left',
    field: (row) => row.retailPrice,
  },
  {
    name: 'costprice',
    required: true,
    label: 'Cost Price',
    align: 'left',
    field: (row) => row.costPrice,
  },
  {
    name: 'mstock',
    label: 'Available Stock',
    align: 'left',
    field: (row) => row.masterStock,
  },
  {
    name: 'commission',
    label: 'Commission',
    align: 'left',
    field: (row) => row.commission,
  },
  {
    name: 'status',
    label: 'Status',
    align: 'left',
    field: (row) => row.status,
  },

  {
    name: 'action',
    label: 'Action',
    align: 'left',
    field: () => '',
  },
];
export const billingHistoryColumn: QTableColumn<IBillingHistoryResponse>[] = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: (row) => row.fullName,
  },
  {
    name: 'price',
    required: true,
    label: 'Price',
    align: 'left',
    field: (row) => row.price,
  },
  {
    name: 'date',
    required: true,
    label: 'Date',
    align: 'left',
    field: (row) => moment(row.billDate).format('Do MM YYYY'),
  },
];
export const articleListColumn: QTableColumn<IArticleData>[] = [
  {
    name: 'image',
    required: true,
    label: 'Image',
    align: 'left',
    field: (row) => row.productImage,
  },
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: (row) => row.name,
  },
  {
    name: 'availableStock',
    required: true,
    label: 'Available Stock',
    align: 'left',
    field: (row) => row.masterStock,
  },
];
