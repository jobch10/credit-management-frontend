import { HttpInterceptorFn } from "@angular/common/http";
import { AuthStore } from "../store/auth.store";
import { inject } from "@angular/core";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const token = authStore.token();

  if (!token) return next(req);

  const cloned = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(cloned);
};