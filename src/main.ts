import {importProvidersFrom, isDevMode} from '@angular/core';
import {AppComponent} from './app/app.component';
import {provideRouter, Routes} from '@angular/router';
import {BrowserModule, bootstrapApplication} from '@angular/platform-browser';
import {ShoppingListRoutes} from './app/shopping-list/route/shopping-list.routes';
import {ShoppingListApiService} from './app/shopping-list/service/shopping-list-api.service';
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
import {MealKindService} from './app/meal/service/meal-kind.service';
import {MealService} from './app/meal/service/meal.service';
import {EventApiService} from './app/event/service/event-api.service';
import {MealsByMealKindService} from './app/meal/service/meals-by-meal-kind.service';
import {EventRoutes} from './app/event/route/event.routes';
import {EventCurrentDateService} from './app/event/service/event-current-date.service';
import {MealCurrentDateService} from './app/meal/service/meal-current-date.service';
import {EditEventService} from './app/event/service/edit-event.service';
import {TranslocoHttpLoader} from './transloco-loader';
import {provideTransloco} from '@ngneat/transloco';
import {ShoppingListGoToService} from './app/shopping-list/service/shopping-list-go-to.service';
import {MealGoToService} from './app/meal/service/meal-go-to.service';
import {SuggestedItemShoppingListApiService} from './app/shopping-list/service/suggested-item-shopping-list-api.service';
import {SuggestedItemShoppingListAutoCompleteService} from './app/shopping-list/service/suggested-item-shopping-list-auto-complete.service';
import {ItemShoppingListApiService} from './app/shopping-list/service/item-shopping-list-api.service';
import {ItemShoppingListRoutes} from './app/shopping-list/route/item-shopping-list.routes';
import {ItemShoppingListGoToService} from './app/shopping-list/service/item-shopping-list-go-to.service';
import {ItemShoppingListCategoryApiService} from './app/shopping-list/service/item-shopping-list-category-api.service';

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
        providers: [
            ShoppingListApiService,
            ShoppingListGoToService,
            ItemShoppingListGoToService,
            ItemShoppingListApiService,
            ItemShoppingListCategoryApiService,
            SuggestedItemShoppingListApiService,
            SuggestedItemShoppingListAutoCompleteService
        ],
        canActivate: [signedInGuard, hasFamilyGuard],
        children: ShoppingListRoutes.shoppingListRoutes
    },
    { 
        path: '',
        providers: [
            ItemShoppingListApiService,
            ItemShoppingListCategoryApiService,
            SuggestedItemShoppingListApiService,
            SuggestedItemShoppingListAutoCompleteService
        ],
        canActivate: [signedInGuard, hasFamilyGuard],
        children: ItemShoppingListRoutes.itemShoppingListRoutes
    },
    { 
        path: '',
        providers: [
            MealKindService,
            MealService,
            MealGoToService,
            MealsByMealKindService,
            MealCurrentDateService
        ],
        canActivate: [signedInGuard, hasFamilyGuard],
        children: MealRoutes.mealRoutes
    },
    {
        path: '',
        providers: [
            EventCurrentDateService,
            EventApiService,
            EditEventService
        ],
        canActivate: [signedInGuard, hasFamilyGuard],
        children: EventRoutes.eventRoutes
    },
    { 
        path: '',
        providers: [
            EventApiService,
            MealKindService,
            MealService,
            MealsByMealKindService,
            ShoppingListApiService,
            ShoppingListGoToService
        ],
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

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, BrowserAnimationsModule),
        provideRouter(routes),
        provideHttpClient(),
        provideAnimations(),
        provideTransloco({
            config: { 
            availableLangs: ['fr'],
            defaultLang: 'fr',
            // Remove this option if your application doesn't support changing language in runtime.
            reRenderOnLangChange: true,
            prodMode: !isDevMode(),
            },
            loader: TranslocoHttpLoader
        })
    ]
})
  .catch(err => console.error(err));
