export interface IVariantData {
  name: string;
  variantGroupId: number;
  status: string;
  variant: string;
  action?: any;
}
export interface IVariantDetailsData {
  variantId: number;
  name: string;
  displayName: string;
  status: string;
  variantGroupName: string;
  variantGroupId: number;
  action?: string;
}
