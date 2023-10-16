export interface IVariantData {
  name: string;
  variantGroupId: number;
  status: string;
  variant: string;
}
export interface IVariantDetailsData {
  variantId: number;
  name: string;
  displayName: string;
  status: string;
  variantGroupName: string;
  variantGroupId: number;
}
export interface IVariantGroup {
  status: string;
  variantGroupId: number;
  name: string;
}
