import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { ShoppingListRoutes } from 'src/app/shopping-list/route/shopping-list.routes';
import { inject } from '@angular/core';

export const notSignedInGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isSignedIn == undefined) {
    return router.navigate(['']);
  }
  if (userService.isSignedIn == true) {
    return router.navigate([ShoppingListRoutes.editShoppingListRoute]);
  }

  return true;
};
