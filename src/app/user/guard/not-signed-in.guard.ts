import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { ShoppingListRoutes } from 'src/app/shopping-list/route/shopping-list.routes';
import { inject } from '@angular/core';
import { LoadingRoutes } from 'src/app/loading/route/loading.routes';
import { HomeRoutes } from 'src/app/home/route/home.routes';

export const notSignedInGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isSignedIn == undefined) {
    return router.navigate([LoadingRoutes.displayLoadingRoute]);
  }
  if (userService.isSignedIn == true) {
    return router.navigate([HomeRoutes.displayHomeRoute]);
  }

  return true;
};
