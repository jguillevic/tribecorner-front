import { Routes } from "@angular/router";

export const editShoppingListRoute: string = 'shopping-list/edit';

export const shoppingListRoutes: Routes = [
    { 
        path: editShoppingListRoute,
        title: 'Ma liste de course',
        loadComponent: () => import('./edit-shopping-list/edit-shopping-list.component').then(module => module.EditShoppingListComponent) 
    },
];