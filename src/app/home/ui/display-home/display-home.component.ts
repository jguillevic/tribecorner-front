import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TabBarComponent } from 'src/app/common/tab-bar/ui/tab-bar/tab-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from 'src/app/user/service/user.service';
import { UserInfo } from 'src/app/user/model/user-info.model';
import { Subscription, forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ShoppingListService } from 'src/app/shopping-list/service/shopping-list.service';
import { ShoppingList } from 'src/app/shopping-list/model/shopping-list.model';
import { ShoppingListRoutes } from 'src/app/shopping-list/route/shopping-list.routes';
import { ShoppingListCardComponent } from "../../../shopping-list/ui/shopping-list-card/shopping-list-card.component";
import { ProfileTopBarComponent } from 'src/app/common/top-bar/profile/ui/profile-top-bar.component';
import { MealRoutes } from 'src/app/meal/route/meal.routes';
import { HomeCategoryComponent } from "../home-category/home-category.component";
import { Meal } from 'src/app/meal/model/meal.model';
import { MatDividerModule } from '@angular/material/divider';
import { Event } from 'src/app/event/model/event.model';
import { MealService } from 'src/app/meal/service/meal.service';
import { EventService } from 'src/app/event/service/event.service';
import { MealCardComponent } from "../../../meal/ui/meal-card/meal-card.component";
import { MealKindService } from 'src/app/meal/service/meal-kind.service';
import { MealKind } from 'src/app/meal/model/meal-kind.model';

@Component({
    selector: 'app-display-home',
    standalone: true,
    templateUrl: './display-home.component.html',
    styles: [],
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
        MealCardComponent
    ]
})
export class DisplayHomeComponent implements OnInit, OnDestroy {
  private loadEventsSubscription: Subscription|undefined;
  private loadMealDataSubscription: Subscription|undefined;
  private loadShoppingListsSubscription: Subscription|undefined;

  public currentUserInfo: UserInfo | undefined;
  public readonly shoppingLists: ShoppingList[] = [];
  public readonly mealKinds: MealKind[] = [];
  public readonly meals: Meal[] = [];
  public readonly events: Event[] = [];
  public isLoadingEvents: boolean = true;
  public isLoadingMealData: boolean = true;
  public isLoadingShoppingLists: boolean = true;

  public constructor(
    private eventService: EventService,
    private mealKindService: MealKindService,
    private mealService: MealService,
    private shoppingListService: ShoppingListService,
    private userService: UserService,
    private router: Router
    ) { }

  public ngOnInit(): void {
    this.currentUserInfo = this.userService.getCurrentUserInfo();

    if (this.currentUserInfo?.familyId) {
      this.loadEventsSubscription = this.eventService
      .loadAll()
      .subscribe(
        events => {
          events.forEach(event => this.events.push(event));
          this.isLoadingEvents = false;
        }
      );

      this.loadMealDataSubscription = forkJoin({
        mealKinds: this.mealKindService
        .loadAll(),
        meals: this.mealService
        .loadAllByDate(new Date(), this.currentUserInfo?.familyId)
      })
      .subscribe(
        result => {
          result.mealKinds.forEach(mealKind => {
            this.mealKinds.push(mealKind);
          });
          result.meals.forEach(meal => {
            this.meals.push(meal);
          });
          this.isLoadingMealData = false;
        }
      );

      this.loadShoppingListsSubscription = this.shoppingListService
      .loadAllByFamilyId(this.currentUserInfo.familyId, 3)
      .subscribe(
        shoppingLists => { 
          shoppingLists.forEach(shoppingList => this.shoppingLists.push(shoppingList));
          this.isLoadingShoppingLists = false;
        });
    }
  }

  public ngOnDestroy(): void {
    this.loadEventsSubscription?.unsubscribe();
    this.loadMealDataSubscription?.unsubscribe();
    this.loadShoppingListsSubscription?.unsubscribe();
  }

  public goToDisplayEvents(): void {

  }

  public goToDisplayMeals(): Promise<boolean> {
    return this.router.navigate([MealRoutes.displayMealsRoute]);
  }

  public goToDisplayShoppingList(shoppingListId: number|undefined): Promise<boolean>|void {
    if (shoppingListId) {
      return this.router.navigate([ShoppingListRoutes.displayShoppingListRoute], { queryParams: { action: 'update', id: shoppingListId } });
    }
  }

  public goToDisplayShoppingLists(): Promise<boolean> {
    return this.router.navigate([ShoppingListRoutes.displayShoppingListsRoute]);
  }
}