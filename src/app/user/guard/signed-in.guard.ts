import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { UserRoutes } from '../route/user.routes';

export const signedInGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isSignedIn) {
    return true;
  }

  return router.navigate([UserRoutes.signUpUserRoute]);
};