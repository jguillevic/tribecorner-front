import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserInfo } from 'src/app/user/model/user-info.model';
import { UserRoutes } from 'src/app/user/route/user.routes';
import { UserService } from 'src/app/user/service/user.service';
import { HomeRoutes } from 'src/app/home/route/home.routes';

export const hasNoFamilyGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const currentUserInfo: UserInfo|undefined = userService.getCurrentUserInfo();

  if (currentUserInfo === undefined) {
    return router.navigate([UserRoutes.signInUserRoute]);
  }
  else if (currentUserInfo.familyId) {
    return router.navigate([HomeRoutes.displayHomeRoute]);
  }
  return true;
};
