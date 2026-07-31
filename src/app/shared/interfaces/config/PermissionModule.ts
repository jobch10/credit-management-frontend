import { Action } from "./Action";

export interface PermissionModule {
  id: number;
  code: string;
  name: string;
  icon?: string;
  state: boolean;
  actions?: Action[];
  children?: PermissionModule[];
  type?: string | null;
  route?: string | null;
  orderNum?: number | null;
  parentId?: number | null;
  createdAt?: string | null;
}