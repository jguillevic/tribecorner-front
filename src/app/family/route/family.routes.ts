import { Routes } from "@angular/router";
import { signedInGuard } from "src/app/user/guard/signed-in.guard";
import { hasNoFamilyGuard } from "../guard/has-no-family.guard";
import { hasFamilyGuard } from "../guard/has-family.guard";

export class FamilyRoutes {
    public static readonly createFamilyRoute: string = 'family/create';
    public static readonly joinFamilyRoute: string = 'family/join';
    public static readonly displayFamilyRoute: string = 'family/display';
    public static readonly familyRoutes: Routes = [
        { 
            path: FamilyRoutes.createFamilyRoute,
            title: 'Créer ma famille',
            canActivate: [signedInGuard, hasNoFamilyGuard],
            loadComponent: () => import('../ui/create-family/create-family.component').then(module => module.CreateFamilyComponent) 
        },
        { 
            path: FamilyRoutes.joinFamilyRoute,
            title: 'Rejoindre ma famille',
            canActivate: [signedInGuard, hasNoFamilyGuard],
            loadComponent: () => import('../ui/join-family/join-family.component').then(module => module.JoinFamilyComponent) 
        },
        { 
            path: FamilyRoutes.displayFamilyRoute,
            title: 'Ma famille',
            canActivate: [signedInGuard, hasFamilyGuard],
            loadComponent: () => import('../ui/display-family/display-family.component').then(module => module.DisplayFamilyComponent) 
        }
    ];
}