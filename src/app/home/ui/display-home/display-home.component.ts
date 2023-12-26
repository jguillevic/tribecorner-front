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
import { ShoppingListCardComponent } from "../../../shopping-list/ui/component/shopping-list-card/shopping-list-card.component";
import { ProfileTopBarComponent } from 'src/app/common/top-bar/profile/ui/profile-top-bar.component';
import { MealRoutes } from 'src/app/meal/route/meal.routes';
import { HomeCategoryComponent } from "../home-category/home-category.component";
import { MatDividerModule } from '@angular/material/divider';
import { Event } from 'src/app/event/model/event.model';
import { EventService } from 'src/app/event/service/event.service';
import { SimpleMealCardComponent } from "../../../meal/ui/component/simple-meal-card/simple-meal-card.component";
import { MealsByMealKind } from 'src/app/meal/model/meals-by-meal-kind.model';
import { MealsByMealKindService } from 'src/app/meal/service/meals-by-meal-kind.service';
import { SimpleLoadingComponent } from "../../../common/loading/ui/simple-loading/simple-loading.component";
import { SimpleEmptyComponent } from "../../../common/empty/ui/simple-empty/simple-empty.component";
import { EventRoutes } from 'src/app/event/route/event.routes';
import { EventCardComponent } from "../../../event/ui/component/event-card/event-card.component";
import { DateHelper } from '../../../common/date/helper/date.helper';
import { ShoppingListGoToService } from '../../../shopping-list/service/shopping-list-go-to.service';

@Component({
    selector: 'app-display-home',
    standalone: true,
    templateUrl: './display-home.component.html',
    styleUrls: ['display-home.component.scss'],
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
        EventCardComponent
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