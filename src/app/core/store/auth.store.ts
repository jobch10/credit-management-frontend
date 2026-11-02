import { AuthenticateResponse, LoginRequest } from '@/app/features/auth/interfaces';
import { AuthService } from '@/app/features/auth/services/auth.service';
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { catchError, filter, finalize, map, of, startWith, switchMap, tap } from 'rxjs';
import { PermissionModule, Role, User } from '../../shared/interfaces/config';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

export interface AuthState {
    token: string | null;
    refreshToken: string | null;
    type: string;
    expiresIn: number | null;
    user: User | null;
    role: Role | null;
    permissionModules: PermissionModule[] | null;
    isLoading: boolean;
    isReady: boolean;
    error: string | null;
}

const initialState: AuthState = {
    token: null,
    refreshToken: null,
    type: 'Bearer',
    expiresIn: null,
    user: null,
    role: null,
    permissionModules: null,
    isLoading: false,
    isReady: false,
    error: null
};

export const AuthStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed((s) => {
        const router = inject(Router);
        const currentUrl = toSignal(
            router.events.pipe(
                filter((e): e is NavigationEnd => e instanceof NavigationEnd),
                map(() => router.url),
                startWith(router.url)
            ),
            { initialValue: router.url }
        );
        return {
            isAuthenticated: computed(() => !!s.token()),
            currentModule: computed(() => {
                const gruposNivel1 = s.permissionModules() ?? [];
                const url = currentUrl();
                for (const grupo of gruposNivel1) {
                    if (!grupo.children?.length) continue;
                    for (const nivel2 of grupo.children) {
                        if (nivel2.route && url.startsWith(nivel2.route)) {
                            return nivel2;
                        }
                        if (nivel2.children?.length) {
                            const nivel3 = nivel2.children.find((c) => c.route && url.startsWith(c.route));
                            if (nivel3) return nivel3;
                        }
                    }
                }
                return null;
            })
        };
    }),
    withMethods((s) => {
        const auth = inject(AuthService);

        const reset = () => patchState(s, { ...initialState, isReady: true });

        const setAuthData = (data: AuthenticateResponse) => {
            patchState(s, {
                user: data.user,
                role: data.role,
                permissionModules: data.permissionModules,
                error: null
            });
        };

        return {
            init() {
                const token = auth.getToken();

                if (!token) {
                    reset();
                    return of(true);
                }

                patchState(s, {
                    token,
                    type: auth.getTokenType() ?? 'Bearer',
                    refreshToken: auth.getRefreshToken(),
                    expiresIn: auth.getExpiresIn(),
                    isReady: false
                });

                return auth.authenticate().pipe(
                    tap((data: AuthenticateResponse) => {
                        setAuthData(data);
                    }),
                    catchError(() => {
                        auth.logout();
                        reset();
                        return of(false);
                    }),
                    finalize(() => patchState(s, { isReady: true }))
                );
            },

            login(payload: LoginRequest) {
                patchState(s, { isLoading: true, error: null });

                return auth.login(payload).pipe(
                    tap((tokens) => {
                        patchState(s, {
                            token: tokens.token,
                            refreshToken: tokens.refreshToken,
                            type: tokens.type ?? 'Bearer',
                            expiresIn: tokens.expiresIn ?? null
                        });
                    }),
                    switchMap(() => auth.authenticate()),
                    tap((data: AuthenticateResponse) => {
                        setAuthData(data);
                        patchState(s, { isReady: true });
                    }),
                    catchError((err) => {
                        patchState(s, {
                            error: err?.error?.message ?? 'Error al iniciar sesión'
                        });
                        return of(null);
                    }),
                    finalize(() => patchState(s, { isLoading: false }))
                );
            },

            refreshProfile() {
                const token = s.token() ?? auth.getToken();

                if (!token) {
                    reset();
                    return of(false);
                }

                patchState(s, { isLoading: true, error: null });

                return auth.authenticate().pipe(
                    tap((data: AuthenticateResponse) => {
                        setAuthData(data);
                    }),
                    map(() => true),
                    catchError((err) => {
                        patchState(s, {
                            error: err?.error?.message ?? 'Error al actualizar permisos'
                        });
                        return of(false);
                    }),
                    finalize(() => patchState(s, { isLoading: false }))
                );
            },

            logout() {
                auth.logout();
                reset();
            }
        };
    })
);
