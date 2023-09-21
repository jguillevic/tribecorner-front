import { Routes } from "@angular/router";

export class ShoppingListRoutes {
    public static readonly displayShoppingListsRoute: string = 'shopping-lists/display';
    public static readonly editShoppingListRoute: string = 'shopping-list/edit';
    public static readonly displayShoppingListRoute: string = 'shopping-list/display';
    public static readonly shoppingListRoutes: Routes = [
        { 
            path: ShoppingListRoutes.displayShoppingListsRoute,
            title: 'Listes',
            loadComponent: () => import('../ui/display-shopping-lists/display-shopping-lists.component').then(module => module.DisplayShoppingListsComponent) 
        },
        { 
            path: ShoppingListRoutes.editShoppingListRoute,
            title: 'Liste',
            loadComponent: () => import('../ui/edit-shopping-list/edit-shopping-list.component').then(module => module.EditShoppingListComponent) 
        },
        { 
            path: ShoppingListRoutes.displayShoppingListRoute,
            title: 'Liste',
            loadComponent: () => import('../ui/display-shopping-list/display-shopping-list.component').then(module => module.DisplayShoppingListComponent) 
        }
    ];
}