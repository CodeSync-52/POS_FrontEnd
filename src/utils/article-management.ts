import moment from 'moment';
import { QTableColumn } from 'quasar';
import {
  IArticleData,
  IBillingHistoryResponse,
  IWholeSalePriceOption,
} from 'src/interfaces';

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
    name: 'mstock',
    label: 'Stock',
    align: 'left',
    field: (row) => row.masterStock,
  },
  {
    name: 'wholeSalePrice',
    required: true,
    label: 'W.P',
    align: 'left',
    field: (row) => row.wholeSalePrice,
  },
  {
    name: 'retailrate',
    required: true,
    label: 'R.P',
    align: 'left',
    field: (row) => row.retailPrice,
  },
  {
    name: 'costprice',
    required: true,
    label: 'C.P',
    align: 'left',
    field: (row) => row.costPrice,
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
export const WholeSalePriceOptionList: IWholeSalePriceOption[] = [
  { name: 'All Articles', statusId: null },
  { name: 'Zero W.P', statusId: 0 },
  { name: 'None Zero W.P', statusId: 1 },
];
