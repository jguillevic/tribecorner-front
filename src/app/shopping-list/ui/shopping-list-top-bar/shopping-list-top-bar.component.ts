import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Observable, Subscription, of } from 'rxjs';
import { ShoppingList } from '../../model/shopping-list.model';
import { Action } from 'src/app/common/action';
import { ShoppingListService } from '../../service/shopping-list.service';
import { Router } from '@angular/router';
import { ShoppingListRoutes } from '../../route/shopping-list.routes';
import { Mode } from '../mode';

@Component({
  selector: 'app-shopping-list-top-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './shopping-list-top-bar.component.html',
  styles: [
  ]
})
export class ShoppingListTopBarComponent implements OnInit, OnDestroy {
  private saveSubscription: Subscription|undefined;
  private deleteSubscription: Subscription|undefined;

  @Input() public shoppingList: ShoppingList|undefined;
  @Input() public currentAction: Action|undefined;
  @Input() public currentMode: Mode|undefined;
  
  public isCreating: boolean|undefined;
  public isUpdating: boolean|undefined;
  public isDisplaying: boolean|undefined;
  public isEditing: boolean|undefined;

  public constructor(
    private location: Location,
    private router: Router,
    private shoppingListService: ShoppingListService
    ) {  }

  public ngOnInit(): void {
    this.isCreating = (this.currentAction == Action.create);
    this.isUpdating = (this.currentAction == Action.update);
    this.isDisplaying = (this.currentMode == Mode.display);
    this.isEditing = (this.currentMode == Mode.edit);
  }

  public ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
    this.deleteSubscription?.unsubscribe();
  }

  public goBack(): void {
    this.saveSubscription = this.save().subscribe(() => this.location.back());
  }

  public setFavorite(): void {
    if (this.shoppingList) {
      this.shoppingList.favorite = !this.shoppingList.favorite;
    }
  }

  private save(): Observable<ShoppingList|undefined> {
    if (this.shoppingList) {
      if (this.currentAction == Action.update) {
        return this.shoppingListService.update(this.shoppingList);
      } else if (this.currentAction == Action.create) {
        return this.shoppingListService.create(this.shoppingList);
      } else {
        return of(undefined);
      }
    } else {
      return of(undefined);
    }
  }

  public delete(): void {
    if (this.shoppingList?.id) {
      this.deleteSubscription = this.shoppingListService.delete(this.shoppingList.id).subscribe(() => {
        this.router.navigate([ShoppingListRoutes.displayShoppingListsRoute]);
      });
    }
  }

  public goToDisplay(): void {
    this.saveSubscription = this.save().subscribe((shoppingList) => { 
      this.router.navigate([ShoppingListRoutes.displayShoppingListRoute], { queryParams: { id: shoppingList?.id } }); 
    });
  }

  public goToEdit(): void {
    this.saveSubscription = this.save().subscribe((shoppingList) => {
      this.router.navigate([ShoppingListRoutes.editShoppingListRoute], { queryParams: { action: Action.update, id: shoppingList?.id } });
    });
  }
}
