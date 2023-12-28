import { Routes } from "@angular/router";

export class HomeRoutes {
    public static readonly displayHomeRoute: string = 'home/display';
    public static readonly homeRoutes: Routes = [
        { 
            path: HomeRoutes.displayHomeRoute,
            title: 'Accueil',
            loadComponent: () => import('../ui/page/display-home-page/display-home-page.component').then(module => module.DisplayHomeComponent) 
        }
    ];
}