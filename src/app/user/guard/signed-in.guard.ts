import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { UserRoutes } from '../route/user.routes';

export const signedInGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isSignedIn == undefined) {
    return router.navigate(['']);
  }
  else if (userService.isSignedIn == false) {
    return router.navigate([UserRoutes.signUpUserRoute]);
  }
  return true;
};