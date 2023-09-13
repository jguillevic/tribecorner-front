import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { ShoppingListRoutes } from './app/shopping-list/route/shopping-list.routes';
import { ShoppingListService } from './app/shopping-list/service/shopping-list.service';
import { provideHttpClient } from '@angular/common/http';
import { UserRoutes } from './app/user/route/user.routes';
import { signedInGuard } from './app/user/guard/signed-in.guard';
import { notSignedInGuard } from './app/user/guard/not-signed-in.guard';
import { LoadingRoutes } from './app/loading/route/loading.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HomeRoutes } from './app/home/route/home.routes';
import { FamilyService } from './app/family/service/family.service';
import { FamilyRoutes } from './app/family/route/family.routes';
import { hasFamilyGuard } from './app/family/guard/has-family.guard';
import { hasNoFamilyGuard } from './app/family/guard/has-no-family.guard';

const routes: Routes = [
    { 
        path: '', 
        redirectTo: LoadingRoutes.displayLoadingRoute, 
        pathMatch: 'full' 
    },
    { 
        path: '',
        children: LoadingRoutes.loadingRoutes
    },
    { 
        path: '',
        providers: [ShoppingListService],
        canActivate: [signedInGuard, hasFamilyGuard],
        children: ShoppingListRoutes.shoppingListRoutes
    },
    { 
        path: '',
        providers: [FamilyService],
        canActivate: [signedInGuard, hasFamilyGuard],
        children: HomeRoutes.homeRoutes
    },
    { 
        path: '',
        providers: [FamilyService],
        canActivate: [signedInGuard, hasNoFamilyGuard],
        children: FamilyRoutes.familyRoutes
    },
    { 
        path: '',
        canActivate: [notSignedInGuard],
        children: UserRoutes.userRoutes
    },
];

bootstrapApplication(AppComponent, {
    providers: [
    importProvidersFrom(BrowserModule),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideAnimations()
]
})
  .catch(err => console.error(err));
