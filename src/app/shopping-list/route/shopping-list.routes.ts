import { Routes } from "@angular/router";

export class ShoppingListRoutes {
    public static readonly editShoppingListRoute: string = 'shopping-list/edit';
    public static readonly shoppingListRoutes: Routes = [
        { 
            path: ShoppingListRoutes.editShoppingListRoute,
            title: 'Liste de course',
            loadComponent: () => import('../ui/edit-shopping-list/edit-shopping-list.component').then(module => module.EditShoppingListComponent) 
        }
    ];
}