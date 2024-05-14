import { QTableColumn } from 'quasar';
import moment from 'moment';
import {
  IAccountReportData,
  IDateWiseShopReportData,
  IHOArticleReportData,
  IHOSaleDetailReportData,
  IHOStockReportData,
  IOutStandingReportData,
  IVendorSaleStockReportData,
} from 'src/interfaces';
export const purchaseStatusOptions = ['Open', 'Cancelled', 'Billed'];
export const accountReportColumn: QTableColumn<IAccountReportData>[] = [
  {
    name: 'date',
    required: true,
    label: 'Date',
    align: 'left',
    field: (row) => moment(row.date).format('DD-MM-YYYY'),
  },
  {
    name: 'transactionDetail',
    required: true,
    label: 'Transaction Detail',
    align: 'left',
    field: (row) => row.transactionDetail,
  },
  {
    name: 'debit',
    required: true,
    label: 'Debit (Out)',
    align: 'left',
    field: (row) => row.debit ?? '-',
  },
  {
    name: 'credit',
    required: true,
    label: 'Credit (In)',
    align: 'left',
    field: (row) => row.credit ?? '-',
  },
  {
    name: 'comment',
    required: true,
    label: 'Comments',
    align: 'left',
    field: (row) => row.comments ?? '-',
  },
  {
    name: 'balance',
    required: true,
    label: 'Balance',
    align: 'left',
    field: (row) => row.balance ?? '-',
  },
];

export const shopsaleReportColumn: QTableColumn<IDateWiseShopReportData>[] = [
  {
    name: 'transactionDate',
    required: true,
    label: 'Date',
    align: 'left',
    field: (row) => moment(row.transactionDate).format('DD-MM-YYYY'),
  },
  {
    name: 'shop',
    required: true,
    label: 'Shop',
    align: 'left',
    field: (row) => row.shop,
  },
  {
    name: 'totalAmount',
    required: true,
    label: 'Total Amount',
    align: 'left',
    field: (row) => row.totalAmount ?? '-',
  },
  {
    name: 'totalQuantity',
    required: true,
    label: 'Total Quantity',
    align: 'left',
    field: (row) => row.quantity ?? '-',
  },
  {
    name: 'discount',
    required: true,
    label: 'Disc',
    align: 'left',
    field: (row) => row.discount ?? '-',
  },
  {
    name: 'netAmount',
    required: true,
    label: 'Net Amount',
    align: 'left',
    field: (row) => row.netAmount ?? '-',
    sortable: true,
  },
];
export const vendorsalestockReportColumn: QTableColumn<IVendorSaleStockReportData>[] =
  [
    {
      name: 'article',
      required: true,
      label: 'Article',
      align: 'left',
      field: (row) => row.article ?? '-',
      sortable: true,
    },
    {
      name: 'image',
      required: true,
      label: 'Img',
      align: 'left',
      field: (row) => row.image ?? '-',
      sortable: false,
    },
    {
      name: 'lastPurchasePrice',
      required: true,
      label: 'Last Purchase Price',
      align: 'left',
      field: (row) => row.lastPurchasePrice ?? '-',
      sortable: true,
    },
    {
      name: 'hoStock',
      required: true,
      label: 'Ho Master Stock',
      align: 'left',
      field: (row) => row.hoStock ?? '-',
      sortable: true,
    },
    {
      name: 'shopStock',
      required: true,
      label: 'Shop Total Stock',
      align: 'left',
      field: (row) => row.shopStock ?? '-',
      sortable: true,
    },
    {
      name: 'shopSaleQty',
      required: true,
      label: 'Total Shop Sale',
      align: 'left',
      field: (row) => row.shopSaleQty ?? '-',
      sortable: true,
    },
    {
      name: 'hoSaleQty',
      required: true,
      label: 'Total WholeSale',
      align: 'left',
      field: (row) => row.hoSaleQty ?? '-',
      sortable: true,
    },
  ];
export const outStandingReportColumn: QTableColumn<IOutStandingReportData>[] = [
  {
    name: 'user',
    required: true,
    label: 'User',
    align: 'left',
    field: (row) => row.user,
  },
  {
    name: 'balance',
    required: true,
    label: 'OutStanding Balance',
    align: 'left',
    field: (row) => row.balance ?? '-',
  },
  {
    name: 'phone',
    required: true,
    label: 'Phone Number',
    align: 'left',
    field: (row) => row.phone ?? '-',
  },
];

export const HOStockReportColumn: QTableColumn<IHOStockReportData>[] = [
  {
    name: 'productName',
    required: true,
    label: 'Article',
    align: 'left',
    field: (row) => row.productName,
  },
  {
    name: 'productImage',
    required: true,
    label: 'Image',
    align: 'left',
    field: (row) => row.productImage,
  },
  {
    name: 'masterStock',
    required: true,
    label: 'Master Stock',
    align: 'left',
    field: (row) => row.masterStock ?? '-',
  },
];

export const HOArticleReportColumn: QTableColumn<IHOArticleReportData>[] = [
  {
    name: 'product',
    required: true,
    label: 'Product',
    align: 'left',
    field: (row) => row.product,
  },
  {
    name: 'image',
    required: true,
    label: 'Image',
    align: 'left',
    field: (row) => row.image,
  },
  {
    name: 'quantity',
    required: true,
    label: 'Quantity',
    align: 'left',
    field: (row) => row.quantity ?? '-',
  },
  {
    name: 'amount',
    required: true,
    label: 'Amount',
    align: 'left',
    field: (row) => row.amount ?? '-',
  },
];

export const HOArticleSaleDetailReportColumn: QTableColumn<IHOSaleDetailReportData>[] =
  [
    {
      name: 'date',
      required: true,
      label: 'Date',
      align: 'left',
      field: (row) => moment(row.date).format('DD-MM-YYYY'),
    },
    {
      name: 'user',
      required: true,
      label: 'User',
      align: 'left',
      field: (row) => row.user,
    },
    {
      name: 'quantity',
      required: true,
      label: 'Quantity',
      align: 'left',
      field: (row) => row.quantity ?? '-',
    },
    {
      name: 'amount',
      required: true,
      label: 'Amount',
      align: 'left',
      field: (row) => row.amount ?? '-',
    },
  ];
