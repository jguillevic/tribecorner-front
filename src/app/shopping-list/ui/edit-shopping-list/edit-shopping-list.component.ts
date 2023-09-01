import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingListService } from '../../service/shopping-list.service';
import { ShoppingList } from '../../model/shopping-list';
import { ShoppingListFormComponent } from '../shopping-list-form/shopping-list-form.component';
import { UserService } from 'src/app/user/service/user.service';
import { Router } from '@angular/router';
import { UserRoutes } from 'src/app/user/route/user.routes';

@Component({
  selector: 'app-edit-shopping-list',
  standalone: true,
  imports: [ShoppingListFormComponent, CommonModule],
  templateUrl: './edit-shopping-list.component.html',
  styles: [
  ]
})
export class EditShoppingListComponent implements OnInit {
  shoppingList: ShoppingList|undefined;

  constructor(
    private shoppingListService: ShoppingListService, 
    private userService: UserService, 
    private router: Router
    ) { }

  public ngOnInit(): void {
    this.shoppingListService.get().subscribe((shoppingLists) => this.shoppingList = shoppingLists.at(0));
  }

  public signOut(): void {
    this.userService.signOut().subscribe(() => { this.router.navigate([UserRoutes.signInUserRoute]); });
  }
}