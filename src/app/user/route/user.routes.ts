import { Routes } from "@angular/router";
import { notSignedInGuard } from "../guard/not-signed-in.guard";
import { signedInGuard } from "../guard/signed-in.guard";

export class UserRoutes {
    public static readonly signUpUserRoute: string = 'user/sign-up';
    public static readonly signInUserRoute: string = 'user/sign-in';
    public static readonly displayUserRoute: string = 'user/display';
    public static readonly userRoutes: Routes = [
        { 
            path: UserRoutes.signUpUserRoute,
            title: 'Créez votre compte',
            canActivate: [notSignedInGuard],
            loadComponent: () => import('../ui/page/sign-up-user-page/sign-up-user-page.component').then(module => module.SignUpUserComponent) 
        },
        { 
            path: UserRoutes.signInUserRoute,
            title: 'Connectez-vous à votre compte',
            canActivate: [notSignedInGuard],
            loadComponent: () => import('../ui/page/sign-in-user-page/sign-in-user-page.component').then(module => module.SignInUserComponent) 
        },
        { 
            path: UserRoutes.displayUserRoute,
            title: 'Mon profil',
            canActivate: [signedInGuard],
            loadComponent: () => import('../ui/page/display-user-page/display-user-page.component').then(module => module.DisplayUserComponent) 
        }
    ];
}