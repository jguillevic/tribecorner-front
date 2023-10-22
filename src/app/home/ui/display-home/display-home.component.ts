import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TabBarComponent } from 'src/app/common/tab-bar/ui/tab-bar/tab-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from 'src/app/user/service/user.service';
import { UserInfo } from 'src/app/user/model/user-info.model';
import { Subscription } from 'rxjs';
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
        MatDividerModule
    ]
})
export class DisplayHomeComponent implements OnInit, OnDestroy {
  private _loadMealsSubscription: Subscription|undefined;
  private _loadShoppingListsSubscription: Subscription|undefined;

  private _currentUserInfo: UserInfo | undefined;
  public get currentUserInfo(): UserInfo | undefined {
    return this._currentUserInfo;
  }
  public set currentUserInfo(value: UserInfo | undefined) {
    this._currentUserInfo = value;
  }

  private readonly _shoppingLists: ShoppingList[] = [];
  public get shoppingLists(): ShoppingList[] {
    return this._shoppingLists;
  }

  private readonly _meals: Meal[] = [];
  public get meals(): Meal[] {
    return this._meals;
  }

  private readonly _events: Event[] = [];
  public get events(): Event[] {
    return this._events;
  }

  private _isLoadingMeals: boolean = true;
  public get isLoadingMeals(): boolean {
    return this._isLoadingMeals;
  }
  public set isLoadingMeals(value: boolean) {
    this._isLoadingMeals = value;
  }

  private _isLoadingShoppingLists: boolean = true;
  public get isLoadingShoppingLists(): boolean {
    return this._isLoadingShoppingLists;
  }
  public set isLoadingShoppingLists(value: boolean) {
    this._isLoadingShoppingLists = value;
  }

  public constructor(
    private _mealService: MealService,
    private _shoppingListService: ShoppingListService,
    private _userService: UserService,
    private _router: Router
    ) { }

  public ngOnInit(): void {
    this.currentUserInfo = this._userService.getCurrentUserInfo();

    if (this.currentUserInfo?.familyId) {
      this._loadMealsSubscription = this._mealService
      .loadAllByDate(new Date(), this.currentUserInfo?.familyId)
      .subscribe(
        meals => {
          meals.forEach(meal => this.meals.push(meal));
          this.isLoadingMeals = false;
        }
      );

      this._loadShoppingListsSubscription = this._shoppingListService
      .loadAllByFamilyId(this.currentUserInfo.familyId, 3)
      .subscribe(
        shoppingLists => { 
          shoppingLists.forEach(shoppingList => this.shoppingLists.push(shoppingList));
          this.isLoadingShoppingLists = false;
        });
    }
  }

  public ngOnDestroy(): void {
    this._loadMealsSubscription?.unsubscribe();
    this._loadShoppingListsSubscription?.unsubscribe();
  }

  public goToDisplayEvents(): void {

  }

  public goToDisplayMeals(): Promise<boolean> {
    return this._router.navigate([MealRoutes.displayMealsRoute]);
  }

  public goToDisplayShoppingList(shoppingListId: number|undefined): Promise<boolean>|void {
    if (shoppingListId) {
      return this._router.navigate([ShoppingListRoutes.displayShoppingListRoute], { queryParams: { action: 'update', id: shoppingListId } });
    }
  }

  public goToDisplayShoppingLists(): Promise<boolean> {
    return this._router.navigate([ShoppingListRoutes.displayShoppingListsRoute]);
  }
}