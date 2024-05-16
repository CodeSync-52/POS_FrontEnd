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
  IShowOnlyDiscount,
  IDailySaleReportData,
  ISlowArticleSaleReportData,
  IProfitLossExpnseDetails,
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
    name: 'balance',
    required: true,
    label: 'Balance',
    align: 'left',
    field: (row) => row.balance ?? '-',
  },
  {
    name: 'comment',
    required: true,
    label: 'Comments',
    align: 'left',
    field: (row) => row.comments ?? '-',
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
export const dailySaleReportColumn: QTableColumn<IDailySaleReportData>[] = [
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
    label: 'Image',
    align: 'left',
    field: (row) => row.image ?? '-',
    sortable: false,
  },
  {
    name: 'quantity',
    required: true,
    label: 'Quantity',
    align: 'left',
    field: (row) => row.quantity ?? '-',
    sortable: true,
  },
  {
    name: 'retailPrice',
    required: true,
    label: 'Retail Price',
    align: 'left',
    field: (row) => row.retailPrice ?? '-',
    sortable: true,
  },
  {
    name: 'discount',
    required: true,
    label: 'Discount',
    align: 'left',
    field: (row) => row.discount ?? '-',
    sortable: true,
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
export const slowArticleSaleReportColumn: QTableColumn<ISlowArticleSaleReportData>[] =
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
      label: 'Image',
      align: 'left',
      field: (row) => row.image ?? '-',
      sortable: false,
    },
    {
      name: 'retailPrice',
      required: true,
      label: 'Retail Price',
      align: 'left',
      field: (row) => row.retailPrice ?? '-',
      sortable: true,
    },
    {
      name: 'totalStock',
      required: true,
      label: 'Total Stock',
      align: 'left',
      field: (row) => row.totalStock ?? '-',
      sortable: true,
    },
    {
      name: 'saleQuantity',
      required: true,
      label: 'Sale Qty',
      align: 'left',
      field: (row) => row.saleQuantity ?? '-',
      sortable: true,
    },
    {
      name: 'salePercentage',
      required: true,
      label: 'Sale %',
      align: 'left',
      field: (row) => row.salePercentage ?? '-',
      sortable: true,
    },
  ];
export const profitLossExpenseColumn: QTableColumn<IProfitLossExpnseDetails>[] =
  [
    {
      name: 'expense',
      required: true,
      label: 'Expense Name',
      align: 'left',
      field: (row) => row.expense ?? '-',
      sortable: true,
    },
    {
      name: 'amount',
      required: true,
      label: 'Amount',
      align: 'left',
      field: (row) => row.amount ?? '-',
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
export const IShowOnlyDiscountOptionList: IShowOnlyDiscount[] = [
  { name: 'All', statusId: -1 },
  { name: 'True', statusId: 1 },
  { name: 'false', statusId: 0 },
];
