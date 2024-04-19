export interface IVariantData extends IVariantGroup {
  status: string;
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
