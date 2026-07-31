import { CanActivateFn, Router } from "@angular/router";
import { AuthStore } from "../store/auth.store";
import { inject } from "@angular/core";

export const guestGuard: CanActivateFn = () => {
  const store = inject(AuthStore);
  const router = inject(Router);

  return store.isAuthenticated()
    ? router.createUrlTree(['/dashboard'])
    : true;
};