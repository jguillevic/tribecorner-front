import {importProvidersFrom, isDevMode} from '@angular/core';
import {AppComponent} from './app/app.component';
import {InMemoryScrollingFeature, InMemoryScrollingOptions, provideRouter, Routes, withInMemoryScrolling} from '@angular/router';
import {BrowserModule, bootstrapApplication} from '@angular/platform-browser';
import {ShoppingListRoutes} from './app/shopping-list/route/shopping-list.routes';
import {provideHttpClient} from '@angular/common/http';
import {UserRoutes} from './app/user/route/user.routes';
import {signedInGuard} from './app/user/guard/signed-in.guard';
import {LoadingRoutes} from './app/loading/route/loading.routes';
import {BrowserAnimationsModule, provideAnimations} from '@angular/platform-browser/animations';
import {HomeRoutes} from './app/home/route/home.routes';
import {FamilyRoutes} from './app/family/route/family.routes';
import {hasFamilyGuard} from './app/family/guard/has-family.guard';
import {NotFoundRoutes} from './app/not-found/route/not-found.routes';
import {MealRoutes} from './app/meal/route/meal.routes';
import {EventRoutes} from './app/event/route/event.routes';
import {TranslocoHttpLoader} from './transloco-loader';
import {provideTransloco} from '@ngneat/transloco';
import {ItemShoppingListRoutes} from './app/shopping-list/route/item-shopping-list.routes';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {getMessaging, provideMessaging} from '@angular/fire/messaging';
import {environment} from './environments/environment';
import {provideServiceWorker} from '@angular/service-worker';

const routes: Routes = [
    { 
        path: '', 
        pathMatch: 'full',
        redirectTo: LoadingRoutes.displayLoadingRoute,
    },
    { 
        path: '',
        children: LoadingRoutes.loadingRoutes
    },
    { 
        path: '',
        canActivate: [signedInGuard, hasFamilyGuard],
        children: ShoppingListRoutes.shoppingListRoutes
    },
    { 
        path: '',
        canActivate: [signedInGuard, hasFamilyGuard],
        children: ItemShoppingListRoutes.itemShoppingListRoutes
    },
    { 
        path: '',
        canActivate: [signedInGuard, hasFamilyGuard],
        children: MealRoutes.mealRoutes
    },
    {
        path: '',
        canActivate: [signedInGuard, hasFamilyGuard],
        children: EventRoutes.eventRoutes
    },
    { 
        path: '',
        canActivate: [signedInGuard, hasFamilyGuard],
        children: HomeRoutes.homeRoutes
    },
    { 
        path: '',
        children: FamilyRoutes.familyRoutes
    },
    { 
        path: '',
        children: UserRoutes.userRoutes
    },
    { 
        path: '',
        children: NotFoundRoutes.notFoundRoutes
    },
    { 
        path: '**',
        pathMatch: 'full',
        redirectTo: NotFoundRoutes.displayNotFound
    }
];

const scrollConfig: InMemoryScrollingOptions = {
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled',
};
const inMemoryScrollingFeature: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig);

bootstrapApplication(AppComponent, {
    providers: [
    importProvidersFrom(BrowserModule, BrowserAnimationsModule),
    importProvidersFrom(provideFirebaseApp(() => initializeApp(environment.firebaseConfig))),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideMessaging(() => getMessaging())),
    provideRouter(routes, inMemoryScrollingFeature),
    provideHttpClient(),
    provideAnimations(),
    provideTransloco({
        config: {
            availableLangs: ['fr'],
            defaultLang: 'fr',
            prodMode: !isDevMode(),
        },
        loader: TranslocoHttpLoader
    }),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
]
})
  .catch(err => console.error(err));
