export interface ICategoryData {
  categoryId: number;
  description: string;
  name: string;
  parentCategory: null | number;
  status: string;
  action?: string;
}
export interface ICategoryDetailsData {
  categoryId: number;
  name: string;
  status: string;
  description: string;
  parentCategoryId: number;
  action: string;
}
