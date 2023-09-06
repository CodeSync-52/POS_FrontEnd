import moment from 'moment';
import { QTableColumn } from 'quasar';
import { ISalesManagementData, IWholeSaleDetailsData } from 'src/interfaces';

export const wholeSaleStatusOptions = ['Open', 'Cancelled', 'Completed'];
export const salesManagementColumn: QTableColumn<ISalesManagementData>[] = [
  {
    name: 'wholesale',
    label: 'Wholesale Id',
    field: (row) => row.wholeSaleId,
    align: 'left',
  },
  {
    name: 'userId',
    label: 'User Id',
    field: (row) => row.userId,
    align: 'left',
  },
  {
    name: 'fullName',
    label: 'Full Name',
    field: (row) => row.fullName,
    align: 'left',
  },
  {
    name: 'wholesaleStatus',
    label: 'Wholesale Status',
    field: (row) => row.wholeSaleStatus,
    align: 'left',
  },
  {
    name: 'totalQuantity',
    label: 'Total Quantity',
    field: (row) => row.totalQuantity,
    align: 'left',
  },
  {
    name: 'totalAmount',
    label: 'Total Amount',
    field: (row) => row.totalAmount,
    align: 'left',
  },
  {
    name: 'discount',
    label: 'Discount',
    field: (row) => row.discount,
    align: 'left',
  },
  {
    name: 'netAmount',
    label: 'Net Amount',
    field: (row) => row.netAmount,
    align: 'left',
  },
  {
    name: 'createdDate',
    label: 'Created Date',
    field: (row) => moment(row.createdDate).format('Do MMMM YYYY'),
    align: 'left',
  },
  {
    name: 'action',
    label: 'Action',
    field: () => '',
    align: 'left',
  },
];
export const selectedSalesArticleColumn: QTableColumn<IWholeSaleDetailsData>[] =
  [
    {
      name: 'productId',
      label: 'Product Id',
      field: (row) => row.productId,
      align: 'left',
    },
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
      name: 'quantity',
      label: 'Quantity',
      field: (row) => row.quantity,
      align: 'left',
    },
    {
      name: 'unitWholeSalePrice',
      label: 'Unit Wholesale Price',
      field: (row) => row.unitWholeSalePrice,
      align: 'left',
    },
    {
      name: 'totalAmount',
      label: 'Total Amount',
      field: (row) => row.totalAmount,
      align: 'left',
    },
    {
      name: 'action',
      label: 'Action',
      field: () => '',
      align: 'left',
    },
  ];
