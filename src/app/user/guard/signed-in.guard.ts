import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { UserRoutes } from '../route/user.routes';
import { LoadingRoutes } from 'src/app/loading/route/loading.routes';

export const signedInGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.getIsSignedIn() == undefined) {
    return router.navigate([LoadingRoutes.displayLoadingRoute]);
  }
  else if (userService.getIsSignedIn() == false) {
    return router.navigate([UserRoutes.signInUserRoute]);
  }
  return true;
};