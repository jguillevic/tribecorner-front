import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { HomeRoutes } from 'src/app/home/route/home.routes';
import { ShoppingListRoutes } from 'src/app/shopping-list/route/shopping-list.routes';

@Component({
  selector: 'app-tab-bar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './tab-bar.component.html',
  styles: [
  ]
})
export class TabBarComponent {
  @Input() selectedIndex: number = 0;

  public constructor(private router: Router) { }

  public goToHome(): Promise<boolean> {
    return this.router.navigate([HomeRoutes.displayHomeRoute]);
  }

  public goToShoppingLists(): Promise<boolean> {
    return this.router.navigate([ShoppingListRoutes.displayShoppingListsRoute]);
  }
}
