export interface IArticleData {
  productId: number;
  name: string;
  description: string;
  categoryName: string;
  wholeSalePrice: number;
  retailPrice: number;
  status: string;
  costPrice: number;
  productImage: string;
  masterStock: null | any;
  action?: string;
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
