import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {UserService} from '../service/user.service';
import {UserRoutes} from '../route/user.routes';
import {LoadingRoutes} from '../../loading/route/loading.routes';
import {from, mergeMap, of} from 'rxjs';

export const signedInGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.isSignedIn$
  .pipe(
    mergeMap((isSignedIn : boolean | undefined) => {
      if (isSignedIn === undefined) {
        return from(router.navigate([LoadingRoutes.displayLoadingRoute]));
      } else if (isSignedIn === false) {
        return from(router.navigate([UserRoutes.signInUserRoute]));
      }
      return of(true);
    })
  );
};