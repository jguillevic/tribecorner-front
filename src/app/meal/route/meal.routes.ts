import { Routes } from '@angular/router';

export class MealRoutes {
    public static readonly editMealRoute: string = 'meal/edit';
    public static readonly displayMealsRoute: string = 'meals/display';
    public static readonly mealRoutes: Routes = [
        { 
            path: MealRoutes.editMealRoute,
            title: 'Éditer mon repas',
            loadComponent: () => import('../ui/page/edit-meal-page/edit-meal-page.component').then(module => module.EditMealPageComponent) 
        },
        { 
            path: MealRoutes.displayMealsRoute,
            title: 'Mon repas',
            loadComponent: () => import('../ui/page/display-meals-page/display-meals-page.component').then(module => module.DisplayMealsPageComponent) 
        }
    ];
}