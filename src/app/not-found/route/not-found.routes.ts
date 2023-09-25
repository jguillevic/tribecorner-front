import { Routes } from "@angular/router";

export class NotFoundRoutes {
    public static readonly displayNotFound: string = 'not-found/display';
    public static readonly notFoundRoutes: Routes = [
        { 
            path: NotFoundRoutes.displayNotFound,
            title: '404 - Oups ! Page non trouvée.',
            loadComponent: () => import('../ui/display-not-found/display-not-found.component').then(module => module.NotFoundComponent) 
        }
    ];
}