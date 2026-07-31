import { Role } from "./Role";

export interface User {
  id?: number | null;
  names?: string | null;
  email?: string | null;
  username?: string | null;
  state?: boolean | null;
  role?: Role | null;
  roleId?: number | null;
}