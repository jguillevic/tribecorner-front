import { Routes } from "@angular/router";

export class ShoppingListRoutes {
    public static readonly displayShoppingListsRoute: string = 'shopping-lists/display';
    public static readonly editShoppingListRoute: string = 'shopping-list/edit';
    public static readonly shoppingListRoutes: Routes = [
        { 
            path: ShoppingListRoutes.displayShoppingListsRoute,
            title: 'Listes',
            loadComponent: () => import('../ui/page/display-shopping-lists-page/display-shopping-lists-page.component').then(module => module.DisplayShoppingListsComponent) 
        },
        { 
            path: ShoppingListRoutes.editShoppingListRoute,
            title: 'Liste',
            loadComponent: () => import('../ui/page/edit-shopping-list-page/edit-shopping-list-page.component').then(module => module.EditShoppingListComponent) 
        }
    ];
}