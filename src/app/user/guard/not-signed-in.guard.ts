import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { inject } from '@angular/core';
import { LoadingRoutes } from 'src/app/loading/route/loading.routes';
import { FamilyRoutes } from 'src/app/family/route/family.routes';

export const notSignedInGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isSignedIn == undefined) {
    return router.navigate([LoadingRoutes.displayLoadingRoute]);
  }
  else if (userService.isSignedIn == true) {
    return router.navigate([FamilyRoutes.createFamilyRoute]);
  }
  return true;
};
