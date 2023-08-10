import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { ShoppingListRoutes } from './app/shopping-list/shopping-list.routes';
import { ShoppingListService } from './app/shopping-list/shopping-list.service';
import { provideHttpClient } from '@angular/common/http';

const routes: Routes = [
    { 
        path: '', 
        redirectTo: ShoppingListRoutes.editShoppingListRoute, 
        pathMatch: 'full' 
    },
    { 
        path: '',
        providers: [ ShoppingListService ],
        children: ShoppingListRoutes.shoppingListRoutes
    }
];

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule),
        provideRouter(routes),
        provideHttpClient()
    ]
})
  .catch(err => console.error(err));
