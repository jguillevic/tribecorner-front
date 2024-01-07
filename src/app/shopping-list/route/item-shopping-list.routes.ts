import { Routes } from "@angular/router";

export class ItemShoppingListRoutes {
    public static readonly editItemShoppingListRoute: string = 'shopping-list/item/edit';
    public static readonly itemShoppingListRoutes: Routes = [
        { 
            path: ItemShoppingListRoutes.editItemShoppingListRoute,
            title: 'Élément de liste',
            loadComponent: () => import('../ui/page/edit-item-shopping-list-page/edit-item-shopping-list-page.component').then(module => module.EditItemShoppingListPageComponent) 
        }
    ];
}