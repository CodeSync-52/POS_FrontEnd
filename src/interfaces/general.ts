export interface IOption<T = string | number> {
  label: string;
  value: T;
}

export type userManagementSearchFilter = {
  customerGroup: null | string | number;
  role: null | string | number;
  status: null | string | number;
};

export enum EUserRoles {
  SuperAdmin = 'superadmin',
  Admin = 'admin',
  Customer = 'customer',
  ShopManager = 'shopmanager',
  ShopOfficer = 'shopofficer',
  OfficeManager = 'officemanager',
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
  ShopDiscountsModule = 16,
  Report = 17,
}

export interface IRoleModule {
  module: { moduleId: EUserModules; moduleName: string; moduleGroup: string };
  actions: IRoleActionResponse[];
}

export interface IRoleActionResponse {
  actionId: EActionPermissions;
  actionName: string;
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
  [EUserModules.CustomerGroupManagement]: 'Customer Group Management',
  [EUserModules.VariantManagement]: 'Variant Management',
  [EUserModules.CategoryManagement]: 'Category Management',
  [EUserModules.ArticleManagement]: 'Article Management',
  [EUserModules.ReceiptManagement]: 'Receipt Management',
  [EUserModules.BillGeneration]: 'Bill Generation',
  [EUserModules.CashInCashOutManagement]: 'Cash In / Cash Out Management',
  [EUserModules.SalesManagement]: 'Sales Management',
  [EUserModules.InventoryManagement]: 'Inventory Management',
  [EUserModules.ShopManagement]: 'Shop Management',
  [EUserModules.GoodsReceiptNotes]: 'Goods Receipt Notes',
  [EUserModules.StockTransferRequests]: 'Stock Transfer Requests',
  [EUserModules.SaleAndReturnManagement]: 'Sale And Return Management',
  [EUserModules.ShopDiscountsModule]: 'Shop Discounts',
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
  roleId: string;
  roleName: EUserRoles;
  permissionModuleActions: IRoleModule[];
}

export interface IGenericResponse<T = unknown> {
  httpStatusCode: number;
  message: string;
  type: number;
  data: T;
}


export const checkNameIsModule = (e: any): e is EUserModules =>
  Object.values(EUserModules).includes(e);
