export interface ICategoryBasic {
  categoryId: number;
  description: string;
  name: string;
  status: string;
}

export interface ICategoryData extends ICategoryBasic {
  parentCategory: null | number;
}
export interface ICategoryDetailsData extends ICategoryBasic {
  parentCategoryId: number;
}
