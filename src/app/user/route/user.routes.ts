import { Routes } from "@angular/router";

export class UserRoutes {
    public static readonly signUpUserRoute: string = 'user/sign-up';
    public static readonly signInUserRoute: string = 'user/sign-in';
    public static readonly userRoutes: Routes = [
        { 
            path: UserRoutes.signUpUserRoute,
            title: 'Créer un compte',
            loadComponent: () => import('../ui/sign-up-user/sign-up-user.component').then(module => module.SignUpUserComponent) 
        },
        { 
            path: UserRoutes.signInUserRoute,
            title: 'Se connecter',
            loadComponent: () => import('../ui/sign-in-user/sign-in-user.component').then(module => module.SignInUserComponent) 
        }
    ];
}