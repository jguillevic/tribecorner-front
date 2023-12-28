import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TabBarComponent } from 'src/app/common/tab-bar/ui/tab-bar/tab-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ShoppingListService } from 'src/app/shopping-list/service/shopping-list.service';
import { ShoppingList } from 'src/app/shopping-list/model/shopping-list.model';
import { ShoppingListRoutes } from 'src/app/shopping-list/route/shopping-list.routes';
import { ShoppingListCardComponent } from "../../../../shopping-list/ui/component/shopping-list-card/shopping-list-card.component";
import { ProfileTopBarComponent } from 'src/app/common/top-bar/profile/ui/profile-top-bar.component';
import { MealRoutes } from '../../../../meal/route/meal.routes';
import { HomeCategoryComponent } from "../../component/home-category/home-category.component";
import { MatDividerModule } from '@angular/material/divider';
import { Event } from '../../../../event/model/event.model';
import { EventService } from '../../../../event/service/event.service';
import { SimpleMealCardComponent } from "../../../../meal/ui/component/simple-meal-card/simple-meal-card.component";
import { MealsByMealKind } from '../../../../meal/model/meals-by-meal-kind.model';
import { MealsByMealKindService } from '../../../../meal/service/meals-by-meal-kind.service';
import { SimpleLoadingComponent } from "../../../../common/loading/ui/simple-loading/simple-loading.component";
import { SimpleEmptyComponent } from "../../../../common/empty/ui/simple-empty/simple-empty.component";
import { EventRoutes } from '../../../../event/route/event.routes';
import { EventCardComponent } from "../../../../event/ui/component/event-card/event-card.component";
import { DateHelper } from '../../../../common/date/helper/date.helper';
import { ShoppingListGoToService } from '../../../../shopping-list/service/shopping-list-go-to.service';
import { TranslocoModule, provideTranslocoScope } from '@ngneat/transloco';

@Component({
    selector: 'app-display-home-page',
    standalone: true,
    templateUrl: './display-home-page.component.html',
    styleUrls: ['display-home-page.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        TabBarComponent,
        MatButtonModule,
        MatIconModule,
        ProfileTopBarComponent,
        ShoppingListCardComponent,
        HomeCategoryComponent,
        MatDividerModule,
        SimpleMealCardComponent,
        SimpleLoadingComponent,
        SimpleEmptyComponent,
        EventCardComponent,
        TranslocoModule
    ],
    providers: [
      provideTranslocoScope({scope: 'home/ui/page/display-home-page', alias: 'displayHomePage'})
    ]
})
export class DisplayHomeComponent {
  public readonly events$: Observable<Event[]> 
  = this.eventService
  .loadAllByDate(DateHelper.getCurrentDate());

  public readonly mealsByMealKinds$: Observable<MealsByMealKind[]> 
  = this.mealsByMealKindService
  .loadAllByDate(DateHelper.getCurrentDate());

  public readonly shoppingLists$: Observable<ShoppingList[]> 
  = this.shoppingListService
  .loadAll(false);

  public constructor(
    private eventService: EventService,
    private mealsByMealKindService: MealsByMealKindService,
    private shoppingListService: ShoppingListService,
    private shoppingListGoToService: ShoppingListGoToService,
    private router: Router
  ) { }

  public goToDisplayEvents(): Promise<boolean> {
    return this.router.navigate([EventRoutes.displayEventsRoute]);
  }

  public goToDisplayMeals(): Promise<boolean> {
    return this.router.navigate([MealRoutes.displayMealsRoute]);
  }

  public goToDisplayShoppingList(shoppingListId: number|undefined): Observable<boolean> {
    return this.shoppingListGoToService.goToUpdate(shoppingListId);
  }

  public goToDisplayShoppingLists(): Promise<boolean> {
    return this.router.navigate([ShoppingListRoutes.displayShoppingListsRoute]);
  }
}