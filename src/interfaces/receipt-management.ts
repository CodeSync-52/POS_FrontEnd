export interface IReceiptData {
  purchaseId: number;
  userId: number;
  fullName: string;
  totalQuantity: number;
  purchaseStatus: string;
  createdDate: string;
  createdBy: null;
  updatedDate: string;
  updatedBy: null;
  action?: string;
}
export interface ISelectedArticleData {
  articleId: number;
  quantity: number;
  article: string;
  action?: string;
}
