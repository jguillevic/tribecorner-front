import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { ShoppingListRoutes } from './app/shopping-list/route/shopping-list.routes';
import { ShoppingListService } from './app/shopping-list/service/shopping-list.service';
import { provideHttpClient } from '@angular/common/http';
import { UserRoutes } from './app/user/route/user.routes';
import { UserService } from './app/user/service/user.service';

const routes: Routes = [
    { 
        path: '', 
        redirectTo: UserRoutes.signUpUserRoute, 
        pathMatch: 'full' 
    },
    { 
        path: '',
        providers: [ ShoppingListService ],
        children: ShoppingListRoutes.shoppingListRoutes
    },
    { 
        path: '',
        providers: [ UserService ],
        children: UserRoutes.userRoutes
    },
];

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule),
        provideRouter(routes),
        provideHttpClient()
    ]
})
  .catch(err => console.error(err));
