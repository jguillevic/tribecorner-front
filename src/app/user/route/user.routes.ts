import { Routes } from "@angular/router";

export class UserRoutes {
    static readonly signUpUserRoute: string = 'user/sign-up';
    static readonly signInUserRoute: string = 'user/sign-in';
    static  readonly userRoutes: Routes = [
        { 
            path: UserRoutes.signUpUserRoute,
            title: 'Créer un compte',
            loadComponent: () => import('../ui/sign-up-user/sign-up-user.component').then(module => module.SignUpUserComponent) 
        },
        { 
            path: UserRoutes.signInUserRoute,
            title: 'Se connecter',
            loadComponent: () => import('../ui/sign-in-user/sign-in-user.component').then(module => module.SignInUserComponent) 
        },

    ];
}