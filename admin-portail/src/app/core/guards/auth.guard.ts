import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  if (token) {
    return true;
  } else {
    await router.navigate(['/login']);
    return false;
  }
};
