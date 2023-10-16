export interface IArticleData {
  productId: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName: string;
  wholeSalePrice: number;
  retailPrice: number;
  status: string;
  costPrice: number;
  productImage: string | null;
  masterStock: null | number;
  commission: number;
}

export interface ISelectedArticle {
  productId: number;
  productName?: string;
  productImage: string | null;
}
export interface IArticleInfo {
  categoryName: string;
  categoryId: number;
  costPrice: number;
  description: string;
  name: string;
  productImage: null | File | undefined;
  retailPrice: number;
  wholeSalePrice: number;
}
export interface IArticleCategory {
  categoryId: number;
  name: string;
  subCategories: IArticleSubCategory[];
}
export interface IArticleSubCategory {
  categoryId: number;
  name: string;
}
export interface INewArticleData extends Omit<IArticleData, 'productImage'> {
  productImage: File | null;
}
export interface IBillingHistoryResponse {
  quantity: number;
  price: number;
  billId: number;
  billDate: string;
  userId: number;
  fullName: string;
  image: string;
  name: string;
  productId: number;
}
