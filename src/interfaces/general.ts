export interface IOption<T = string | number> {
  label: string;
  value: T;
}

export enum EUserRoles {
  SuperAdmin = 'SuperAdmin',
  Admin = 'Admin',
  Customer = 'Customer',
  ShopManager = 'ShopManager',
  ShopOfficer = 'ShopOfficer',
  OfficeManager = 'OfficeManager',
}

export enum EActionPermissions {
  View = 1,
  Create = 2,
  Update = 3,
  Delete = 4,
}

export enum EUserModules {
  UserManagment = 1,
  RolePermission = 2,
  CustomerGroupManagement = 3,
  VariantManagement = 4,
  CategoryManagement = 5,
  ArticleManagement = 6,
  ReceiptManagement = 7,
  BillGeneration = 8,
  CashInCashOutManagement = 9,
  SalesManagement = 10,
  InventoryManagement = 11,
  ShopManagement = 12,
  GoodsReceiptNotes = 13,
  StockTransferRequests = 14,
  SaleAndReturnManagement = 15,
  ShopAccountModule = 16,
  Report = 17,
}

export interface IRoleModule {
  moduleId: EUserModules;
  moduleName: string;
  actionIds: EActionPermissions[];
}

export interface IRoleActionResponse {
  actionId: EActionPermissions;
}

const roleDisplayList: Record<EUserRoles, string> = {
  [EUserRoles.Admin]: 'Admin',
  [EUserRoles.Customer]: 'Customer',
  [EUserRoles.OfficeManager]: 'Office Manager',
  [EUserRoles.ShopManager]: 'Shop Manager',
  [EUserRoles.ShopOfficer]: 'Shop Officer',
  [EUserRoles.SuperAdmin]: 'Super Admin',
};

const roleModuleList: Record<EUserModules, string> = {
  [EUserModules.UserManagment]: 'User Management',
  [EUserModules.RolePermission]: 'Role Permission',
  [EUserModules.CustomerGroupManagement]: 'User Category Management',
  [EUserModules.VariantManagement]: 'Variant Group Management',
  [EUserModules.CategoryManagement]: 'Category Management',
  [EUserModules.ArticleManagement]: 'Article Management',
  [EUserModules.ReceiptManagement]: 'Receipt Management',
  [EUserModules.BillGeneration]: 'Bill Generation',
  [EUserModules.CashInCashOutManagement]: 'Cash Flow Management',
  [EUserModules.SalesManagement]: 'Sales Management',
  [EUserModules.InventoryManagement]: 'Inventory Management',
  [EUserModules.ShopManagement]: 'Shop Management',
  [EUserModules.GoodsReceiptNotes]: 'Stock Transfer (STR)',
  [EUserModules.StockTransferRequests]: 'STR Receiving',
  [EUserModules.SaleAndReturnManagement]: 'Shop Sale Management',
  [EUserModules.ShopAccountModule]: 'Shop Accounts',
  [EUserModules.Report]: 'Report',
};

export function getRoleModuleDisplayName(key: EUserModules) {
  return roleModuleList[key];
}

export function getRoleDisplayName(key: EUserRoles) {
  return roleDisplayList[key];
}

export interface IUser {
  aspNetUserId: string;
  fullName: string;
  userId: number;
  loginTokenResponseDTO: LoginTokenResponseDTO;
  rolePermissions: RolePermissions;
  userShopInfoDTO: IUserShopInfo;
  isRetailDiscountAllowed: boolean;
}
export interface IUserShopInfo {
  shopId: number;
  shopName: string;
}

export interface LoginTokenResponseDTO {
  access_Token: string;
  access_Token_Expires_In: number;
  token_Type: string;
  userId: string;
  refresh_Token?: null;
  refresh_Token_Expires_In: number;
  error?: null;
  error_Description?: null;
  message?: null;
}
export interface RolePermissions {
  permissionModuleActions: IRoleModule[];
  roleName: EUserRoles;
}

export interface IGenericResponse<T = unknown> {
  httpStatusCode: number;
  message: string;
  type: string;
  data: T;
}

export const checkNameIsModule = (e: any): e is EUserModules =>
  Object.values(EUserModules).includes(e);

export interface IPagination {
  sortBy: string;
  descending: boolean;
  page: number;
  rowsPerPage: number;
  rowsNumber: number;
}
export enum ShopSalesStatus {
  Completed = 1,
  Hold = 2,
  Cancelled = 3,
}
export const DisplaySalesStatus: Record<ShopSalesStatus, string> = {
  [ShopSalesStatus.Completed]: 'Completed',
  [ShopSalesStatus.Cancelled]: 'Cancelled',
  [ShopSalesStatus.Hold]: 'Hold',
};
