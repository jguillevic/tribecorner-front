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
            loadComponent: () => import('../ui/sign-up-user/sign-up-user.component').then(module => module.SignUpUserComponent) 
        },
        { 
            path: UserRoutes.signInUserRoute,
            title: 'Connectez-vous à votre compte',
            canActivate: [notSignedInGuard],
            loadComponent: () => import('../ui/sign-in-user/sign-in-user.component').then(module => module.SignInUserComponent) 
        },
        { 
            path: UserRoutes.displayUserRoute,
            title: 'Mon profil',
            canActivate: [signedInGuard],
            loadComponent: () => import('../ui/display-user/display-user.component').then(module => module.DisplayUserComponent) 
        }
    ];
}