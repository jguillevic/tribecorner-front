import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { editShoppingListRoute } from './app/shopping-list/shopping-list.routes';
import { ShoppingListService } from './app/shopping-list/shopping-list.service';

const routes: Routes = [
    { 
        path: '', 
        redirectTo: editShoppingListRoute, 
        pathMatch: 'full' 
    },
    { 
        path: '',
        providers: [ ShoppingListService ],
        loadChildren: () => import('./app/shopping-list/shopping-list.routes').then(module => module.shoppingListRoutes) 
    }
];

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule),
        provideRouter(routes)
    ]
})
  .catch(err => console.error(err));
