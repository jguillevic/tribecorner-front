import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from 'src/app/user/service/user.service';
import { UserRoutes } from 'src/app/user/route/user.routes';
import { UserInfo } from 'src/app/user/model/user-info.model';
import { FamilyRoutes } from '../route/family.routes';

export const hasFamilyGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const currentUserInfo: UserInfo|undefined = userService.getCurrentUserInfo();

  if (currentUserInfo === undefined) {
    return router.navigate([UserRoutes.signInUserRoute]);
  }
  else if (!currentUserInfo.familyId) {
    return router.navigate([FamilyRoutes.createFamilyRoute]);
  }
  return true;
};
