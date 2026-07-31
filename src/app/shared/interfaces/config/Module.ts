import { EnumModuleType } from "../../enums";
import { Action } from "./Action";

export interface Module {
  id: number;
  name: string;
  description?: string | null;
  code: string;
  icon?: string | null;
  state: boolean;
  children?: Module[];
  actions?: Action[];
  route?: string | null;
  type?: EnumModuleType | null;
  parentId?: number | null;
}