import { Routes } from "@angular/router";

export class FamilyRoutes {
    public static readonly createFamilyRoute: string = 'family/create';
    public static readonly joinFamilyRoute: string = 'family/join';
    public static readonly familyRoutes: Routes = [
        { 
            path: FamilyRoutes.createFamilyRoute,
            title: 'Créer ma famille',
            loadComponent: () => import('../ui/create-family/create-family.component').then(module => module.CreateFamilyComponent) 
        },
        { 
            path: FamilyRoutes.joinFamilyRoute,
            title: 'Rejoindre ma famille',
            loadComponent: () => import('../ui/join-family/join-family.component').then(module => module.JoinFamilyComponent) 
        }
    ];
}