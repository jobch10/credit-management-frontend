import { PermissionModule, Role, User } from '@/app/shared/interfaces/config';

export interface AuthenticateResponse {
    user?: User | null;
    role?: Role | null;
    permissionModules?: PermissionModule[] | null;
}
