import { Routes } from "@angular/router";

export class LoadingRoutes {
    public static readonly displayLoadingRoute: string = 'loading/display';
    public static readonly loadingRoutes: Routes = [
        { 
            path: LoadingRoutes.displayLoadingRoute,
            title: 'Chargement',
            loadComponent: () => import('../ui/display-loading/display-loading.component').then(module => module.DisplayLoadingComponent) 
        }
    ];
}