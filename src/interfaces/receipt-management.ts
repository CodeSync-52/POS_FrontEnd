export interface IReceiptData {
  purchaseId: number;
  userId: number;
  fullName: string;
  totalQuantity: number;
  purchaseStatus: string;
  createdDate: string;
  createdBy: null;
  updatedDate: string;
  createdById: number;
  updatedBy: null;
  purchaseDetails: {
    productId: number;
    productName: string;
    purchaseDetailId: number;
    quantity: number;
  }[];
}

export interface ISelectedArticleData {
  productId: number | null;
  quantity?: number | null;
  productName?: string;
  purchaseDetailId?: number;
}

export interface IProductList {
  productId: null | number;
  quantity: null | number;
}
export interface IAddNewReceipt {
  userId: number | null;
  productList: IProductList[];
}
