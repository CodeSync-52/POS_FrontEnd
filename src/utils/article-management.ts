import { QTableColumn } from 'quasar';
import { IArticleData } from 'src/interfaces';

export const ArticleColumn: QTableColumn<IArticleData>[] = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    sortable: true,
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
    name: 'status',
    required: true,
    label: 'Status',
    align: 'left',
    field: (row) => row.status,
  },
  {
    name: 'mstock',
    required: true,
    label: 'M.Stock',
    align: 'left',
    sortable: true,
    field: (row) => row.masterStock,
  },
  {
    name: 'action',
    required: true,
    label: 'Action',
    align: 'left',
    field: (row) => row.action,
  },
];
export const ArticleRow: IArticleData[] = [
  {
    productId: 1,
    name: 'string',
    productImage: 'string',
    categoryName: 'string',
    wholeSalePrice: 1,
    retailPrice: 1,
    costPrice: 1,
    status: 'string',
    description: 'string',
    masterStock: null,
    action: 'string',
  },
];
