export interface IAdminRole {
  action: string;
  id: number;
  name: string;
  roles: {
    create: boolean;
    delete: boolean;
    edit: boolean;
    id: number;
    role: string;
    view: boolean;
  }[];
}
