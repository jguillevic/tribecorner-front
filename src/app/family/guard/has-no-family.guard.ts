import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {UserInfo} from '../../user/model/user-info.model';
import {UserRoutes} from '../../user/route/user.routes';
import {UserService} from '../../user/service/user.service';
import {HomeRoutes} from '../../home/route/home.routes';

export const hasNoFamilyGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);
  const currentUserInfo: UserInfo|undefined = userService.userInfo;

  if (currentUserInfo === undefined) {
    return router.navigate([UserRoutes.signInUserRoute]);
  } else if (currentUserInfo.familyId) {
    return router.navigate([HomeRoutes.displayHomeRoute]);
  }
  return true;
};
