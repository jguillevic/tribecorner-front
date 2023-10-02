import { Routes } from '@angular/router';

export class MealRoutes {
    public static readonly editMealRoute: string = 'meal/edit';
    public static readonly displayMealsRoute: string = 'meals/display';
    public static readonly mealRoutes: Routes = [
        { 
            path: MealRoutes.editMealRoute,
            title: 'Éditer mon repas',
            loadComponent: () => import('../ui/edit-meal/edit-meal.component').then(module => module.EditMealComponent) 
        },
        { 
            path: MealRoutes.displayMealsRoute,
            title: 'Mon repas',
            loadComponent: () => import('../ui/display-meals/display-meals.component').then(module => module.DisplayMealsComponent) 
        }
    ];
}