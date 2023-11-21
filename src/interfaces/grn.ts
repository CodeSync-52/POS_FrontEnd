export interface ISelectedPayload {
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
export interface IGrnDetailsWithId {
  productId: number;
  variantId_1: number;
  variantId_2: number;
  quantity: number;
  inventoryId?: number;
  productName?: string;
  productImage?: string;
  productCode?: string;
}
export interface IGrnListFilter {
  ToDate: string | null;
  FromDate: string | null;
  fromShopId: null | number;
  toShopId: null | number;
}
export interface IGrnRecords {
  grnId: number;
  fromShopId: number;
  toShopId: number;
  fromShopName: string;
  toShopName: string;
  quantity: number;
  grnStatus: string;
  addedDate: string;
}

export interface IGrnPreviewResponse {
  grnId: number;
  fromShopId: number;
  toShopId: number;
  fromShopName: string;
  toShopName: string;
  quantity: number;
  grnStatus: string;
  addedDate: string;
  grnDetails: IPreviewGrnDetail[];
}

export interface IPreviewGrnDetail {
  productName: string;
  productImage: string;
  productCode: string;
  variant_1_Name: string;
  grnDetailId: number;
  variant_2_Name: string;
  productId: number;
  variantId_1: number;
  variantId_2: number;
  quantity: number;
}

export interface IProductGRN {
  productId: number;
  productName: string;
  productImage: string | null;
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

export interface PurchaseOrder {
  id?: 0;
  action: '';
  name: '';
  supplier?: {
    id: '';
    vendorname: '';
  };
  orders: {
    id?: 0;
    name: '';
  }[];
  approver?: {
    id: 0;
    email: '';
    full_name: '';
    display_name: '';
  };
  created_by?: {
    id: 0;
    email: '';
    full_name: '';
    display_name: '';
  };
  comment: '';
  currency: '';
  status: [];
  division: {
    id?: 0;
    name: '';
    report_by_contract: false;
    report_period: 'monthly';
    division_group: 0;
  };
  payment_term: '';
  shipping_location: '';
  net_total: '';
  shipping_method: '';
  shipping_charges: '';
  discount: '';
  tax: '';
  grand_total: '';
  purchaseorderitem_set: [];
  required_by: '';
  readonly created?: '';
  readonly modified?: '';
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

interface FirstVariantSelection {
  variantId: number;
  displayName: string;
}

interface SecondVariantSelection {
  variantId: number;
  displayName: string;
  quantity: number;
  grnDetailId: number;
}

interface ProductDetail {
  productId: number;
  quantity: number;
  productName: string;
  grnDetailId: number;
  firstVariantSelection: FirstVariantSelection[];
  secondVariantSelection: SecondVariantSelection[];
}

export type OrderDetails = ProductDetail[][];
