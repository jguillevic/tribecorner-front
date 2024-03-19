import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {UserService} from '../../user/service/user.service';
import {UserRoutes} from '../../user/route/user.routes';
import {UserInfo} from '../../user/model/user-info.model';
import {FamilyRoutes} from '../route/family.routes';

export const hasFamilyGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);
  const currentUserInfo: UserInfo|undefined = userService.getCurrentUserInfo();

  if (currentUserInfo === undefined) {
    return router.navigate([UserRoutes.signInUserRoute]);
  } else if (!currentUserInfo.familyId) {
    return router.navigate([FamilyRoutes.createFamilyRoute]);
  }
  return true;
};
