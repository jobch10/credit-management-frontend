import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthStore } from '../store/auth.store';

export const permissionGuard: CanActivateFn = (route, state) => {
    const authStore = inject(AuthStore);
    const router = inject(Router);
    const messageService = inject(MessageService);

    const gruposNivel1 = authStore.permissionModules() ?? [];

    const targetUrl = state.url;

    let hasAccess = false;

    for (const grupo of gruposNivel1) {
        if (!grupo.children?.length) continue;

        for (const nivel2 of grupo.children) {
            if (nivel2.route && targetUrl.startsWith(nivel2.route)) {
                hasAccess = true;
                break;
            }

            if (nivel2.children?.length) {
                const nivel3 = nivel2.children.some((c) => c.route && targetUrl.startsWith(c.route));
                if (nivel3) {
                    hasAccess = true;
                    break;
                }
            }
        }
        if (hasAccess) break;
    }

    if (hasAccess) {
        return true;
    }
    messageService.add({
        severity: 'warn',
        summary: 'Seguridad',
        detail: `[Seguridad] Intento de acceso no autorizado a: ${targetUrl}`
    });
    router.navigate(['/notfound']);
    return false;
};
