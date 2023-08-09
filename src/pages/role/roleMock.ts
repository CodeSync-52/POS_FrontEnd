import { IUserRole } from 'src/interfaces';

export const rolesMock: IUserRole[] = [
  {
    id: 1,
    name: 'Super Admin',
    action: 'edit',
    roles: [
      {
        moduleId: 1,
        moduleName: 'UserManagment',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 2,
        moduleName: 'RolePermission',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 3,
        moduleName: 'CustomerGroupManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 4,
        moduleName: 'VariantManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 5,
        moduleName: 'CategoryManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 6,
        moduleName: 'ArticleManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 7,
        moduleName: 'ReceiptManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 8,
        moduleName: 'BillGeneration',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 9,
        moduleName: 'CashInCashOutManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 10,
        moduleName: 'SalesManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 11,
        moduleName: 'InventoryManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 12,
        moduleName: 'ShopManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 13,
        moduleName: 'GoodsReceiptNotes',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 14,
        moduleName: 'StockTransferRequests',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 15,
        moduleName: 'SaleAndReturnManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 16,
        moduleName: 'ShopDiscountsModule',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 17,
        moduleName: 'Reports',
        actionIds: [1, 2, 3, 4],
      },
    ],
  },
  {
    id: 2,
    name: 'Admin',
    action: 'edit',
    roles: [
      {
        moduleId: 1,
        moduleName: 'UserManagment',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 2,
        moduleName: 'RolePermission',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 3,
        moduleName: 'CustomerGroupManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 4,
        moduleName: 'VariantManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 5,
        moduleName: 'CategoryManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 6,
        moduleName: 'ArticleManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 7,
        moduleName: 'ReceiptManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 8,
        moduleName: 'BillGeneration',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 9,
        moduleName: 'CashInCashOutManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 10,
        moduleName: 'SalesManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 11,
        moduleName: 'InventoryManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 12,
        moduleName: 'ShopManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 13,
        moduleName: 'GoodsReceiptNotes',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 14,
        moduleName: 'StockTransferRequests',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 15,
        moduleName: 'SaleAndReturnManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 16,
        moduleName: 'ShopDiscountsModule',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 17,
        moduleName: 'Reports',
        actionIds: [1, 2, 3, 4],
      },
    ],
  },
  {
    id: 3,
    name: 'Shop Manager',
    action: 'edit',
    roles: [
      {
        moduleId: 1,
        moduleName: 'UserManagment',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 2,
        moduleName: 'RolePermission',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 3,
        moduleName: 'CustomerGroupManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 4,
        moduleName: 'VariantManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 5,
        moduleName: 'CategoryManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 6,
        moduleName: 'ArticleManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 7,
        moduleName: 'ReceiptManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 8,
        moduleName: 'BillGeneration',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 9,
        moduleName: 'CashInCashOutManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 10,
        moduleName: 'SalesManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 11,
        moduleName: 'InventoryManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 12,
        moduleName: 'ShopManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 13,
        moduleName: 'GoodsReceiptNotes',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 14,
        moduleName: 'StockTransferRequests',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 15,
        moduleName: 'SaleAndReturnManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 16,
        moduleName: 'ShopDiscountsModule',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 17,
        moduleName: 'Reports',
        actionIds: [1, 2, 3, 4],
      },
    ],
  },
  {
    id: 4,
    name: 'Office Boy',
    action: 'edit',
    roles: [
      {
        moduleId: 1,
        moduleName: 'UserManagment',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 2,
        moduleName: 'RolePermission',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 3,
        moduleName: 'CustomerGroupManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 4,
        moduleName: 'VariantManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 5,
        moduleName: 'CategoryManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 6,
        moduleName: 'ArticleManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 7,
        moduleName: 'ReceiptManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 8,
        moduleName: 'BillGeneration',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 9,
        moduleName: 'CashInCashOutManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 10,
        moduleName: 'SalesManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 11,
        moduleName: 'InventoryManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 12,
        moduleName: 'ShopManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 13,
        moduleName: 'GoodsReceiptNotes',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 14,
        moduleName: 'StockTransferRequests',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 15,
        moduleName: 'SaleAndReturnManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 16,
        moduleName: 'ShopDiscountsModule',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 17,
        moduleName: 'Reports',
        actionIds: [1, 2, 3, 4],
      },
    ],
  },
  {
    id: 5,
    name: 'Shop Sale Officer',
    action: 'edit',
    roles: [
      {
        moduleId: 1,
        moduleName: 'UserManagment',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 2,
        moduleName: 'RolePermission',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 3,
        moduleName: 'CustomerGroupManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 4,
        moduleName: 'VariantManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 5,
        moduleName: 'CategoryManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 6,
        moduleName: 'ArticleManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 7,
        moduleName: 'ReceiptManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 8,
        moduleName: 'BillGeneration',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 9,
        moduleName: 'CashInCashOutManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 10,
        moduleName: 'SalesManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 11,
        moduleName: 'InventoryManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 12,
        moduleName: 'ShopManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 13,
        moduleName: 'GoodsReceiptNotes',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 14,
        moduleName: 'StockTransferRequests',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 15,
        moduleName: 'SaleAndReturnManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 16,
        moduleName: 'ShopDiscountsModule',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 17,
        moduleName: 'Reports',
        actionIds: [1, 2, 3, 4],
      },
    ],
  },
  {
    id: 6,
    name: 'Customer/Vendor',
    action: 'edit',
    roles: [
      {
        moduleId: 1,
        moduleName: 'UserManagment',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 2,
        moduleName: 'RolePermission',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 3,
        moduleName: 'CustomerGroupManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 4,
        moduleName: 'VariantManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 5,
        moduleName: 'CategoryManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 6,
        moduleName: 'ArticleManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 7,
        moduleName: 'ReceiptManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 8,
        moduleName: 'BillGeneration',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 9,
        moduleName: 'CashInCashOutManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 10,
        moduleName: 'SalesManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 11,
        moduleName: 'InventoryManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 12,
        moduleName: 'ShopManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 13,
        moduleName: 'GoodsReceiptNotes',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 14,
        moduleName: 'StockTransferRequests',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 15,
        moduleName: 'SaleAndReturnManagement',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 16,
        moduleName: 'ShopDiscountsModule',
        actionIds: [1, 2, 3, 4],
      },
      {
        moduleId: 17,
        moduleName: 'Reports',
        actionIds: [1, 2, 3, 4],
      },
    ],
  },
];
