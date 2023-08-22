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
  masterStock: null | any;
  action?: string;
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
export interface INewArticleData {
  name: string;
  category: string;
  image: File | null;
  description: string;
  categoryId: number;
}
