import moment from 'moment';
import { QTableColumn } from 'quasar';
import { ISalesManagementData, IWholeSaleDetailsData } from 'src/interfaces';

export const wholeSaleStatusOptions = ['Open', 'Cancelled', 'Completed'];
export const salesManagementColumn: QTableColumn<ISalesManagementData>[] = [
  {
    name: 'createdDate',
    label: 'Date',
    field: (row) => moment(row.createdDate).format('DD-MM-YYYY'),
    align: 'left',
  },
  {
    name: 'fullName',
    label: 'Full Name',
    field: (row) => row.fullName,
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
    name: 'totalQuantity',
    label: 'Total Quantity',
    field: (row) => row.totalQuantity,
    align: 'left',
  },
  {
    name: 'wholesaleStatus',
    label: 'Wholesale Status',
    field: (row) => row.wholeSaleStatus,
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
      name: 'masterStock',
      label: 'Available Stock',
      field: (row) => row.masterStock,
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
