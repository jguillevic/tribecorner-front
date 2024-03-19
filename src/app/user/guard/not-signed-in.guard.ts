import {CanActivateFn, Router} from '@angular/router';
import {UserService} from '../service/user.service';
import {inject} from '@angular/core';
import {LoadingRoutes} from '../../loading/route/loading.routes';
import {FamilyRoutes} from '../../family/route/family.routes';
import {from, mergeMap, of} from 'rxjs';

export const notSignedInGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.isSignedIn$
  .pipe(
    mergeMap((isSignedIn : boolean | undefined) => { 
      if (isSignedIn === undefined) {
        return from(router.navigate([LoadingRoutes.displayLoadingRoute]));
      } else if (isSignedIn === true) {
        return from(router.navigate([FamilyRoutes.createFamilyRoute]));
      }
      return of(true);
    })
  );
};
