export interface ISelectedGRNRecord {
  fromShopId: number | null;
  toShopId: number | null;
  grnDetails: IGrnDetails[];
}
export interface IGrnDetails {
  productId: number;
  variantId_1: number;
  variantId_2: number;
  quantity: number;
}
export interface IGrnDetailsWithId extends IGrnDetails {
  retailPrice: number;
  inventoryId?: number;
  productName?: string;
  productImage?: string;
  productCode?: string;
}
export interface IGrnDetailsWithdiscount extends IGrnDetailsWithId {
  discount?: number;
}
export interface IGrnListFilter {
  ToDate: string | null;
  FromDate: string | null;
  fromShopId: null | number;
  toShopId: null | number;
}
export interface IGrnRecord {
  grnId: number;
  fromShopId: number;
  toShopId: number;
  fromShopName: string;
  toShopName: string;
  quantity: number;
  grnStatus: string;
  addedDate: string;
}
export interface IGrnPreviewResponse extends IGrnRecord{
  grnDetails: IPreviewGrnDetail[];
}
export interface IPreviewGrnDetail extends IGrnDetails{
  productName: string;
  productImage: string;
  productCode: string;
  variant_1_Name: string;
  grnDetailId: number;
  variant_2_Name: string;
  retailPrice: number;
}
export interface IProductGRN {
  productId: number;
  productName: string;
  productImage: string | null;
  retailPrice: number;
  data: ProductVariant[];
}
export interface ProductVariant {
  variantId1: number;
  variantName1: string;
  variantId2: number;
  variantName2: string;
  selectedGrnId: number;
  quantity: number;
  v2details: V2Detail[];
}
export interface V2Detail {
  grnDetailId: number;
  productName: string;
  productCode: string;
  productImage: string | null;
  variant_1_Name: string;
  variant_2_Name: string;
  productId: number;
  variantId_1: number;
  variantId_2: number;
  quantity: number;
}
export interface IPreviewGrnPayload {
  productId: number;
  productName: string;
  quantity: number;
  productImage: string;
  grnDetailId: number;
  firstVariantSelection: {
    variantId: number;
    displayName: string;
  }[];
  secondVariantSelection: {
    variantId: number;
    displayName: string;
    quantity: number;
    grnDetailId: number;
  }[];
}

export interface IGrnDetailProductData {
  productId: number;
  quantity: number;
  productName: string;
  grnDetailId: number;
  firstVariantSelection: IGrnDetailVariant[];
  secondVariantSelection: IGrnDetailVariant[];
}

export interface IGrnDetailVariant {
  variantId: number;
  displayName: string;
  quantity?: number;
  grnDetailId?: number;
}

interface VariantSelection {
  variantId: number;
  displayName: string;
}

interface SecondVariantSelection extends VariantSelection {
  quantity: number;
  grnDetailId: number;
}

interface ProductDetail {
  productId: number;
  quantity: number;
  productName: string;
  grnDetailId: number;
  firstVariantSelection: VariantSelection[];
  secondVariantSelection: SecondVariantSelection[];
}

export interface IGrnStatusOptionList {
  name: string;
  statusId: number;
}
export type OrderDetails = ProductDetail[][];
