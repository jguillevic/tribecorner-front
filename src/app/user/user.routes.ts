import { Routes } from "@angular/router";

export class UserRoutes {
    static readonly signupUserRoute: string = 'user/signup';
    static readonly signinUserRoute: string = 'user/signin';
    static  readonly userRoutes: Routes = [
        { 
            path: UserRoutes.signupUserRoute,
            title: 'Créer un compte',
            loadComponent: () => import('./signup-user/signup-user.component').then(module => module.SignupUserComponent) 
        },
        { 
            path: UserRoutes.signinUserRoute,
            title: 'Se connecter',
            loadComponent: () => import('./signin-user/signin-user.component').then(module => module.SigninUserComponent) 
        },

    ];
}