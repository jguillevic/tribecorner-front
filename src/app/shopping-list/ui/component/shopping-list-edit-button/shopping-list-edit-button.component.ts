import { Component, Input } from '@angular/core';

import { ShoppingListGoToService } from 'src/app/shopping-list/service/shopping-list-go-to.service';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MtxButtonModule } from '@ng-matero/extensions/button';

@Component({
    selector: 'app-shopping-list-edit-button',
    standalone: true,
    imports: [
    MatButtonModule,
    MatIconModule,
    MtxButtonModule
],
    templateUrl: './shopping-list-edit-button.component.html',
    styles: [
    ]
})
export class ShoppingListEditButtonComponent {
    @Input() public shoppingListId: number|undefined = 0;

    public isGoingToEdit: boolean = false;

    public constructor(
        private shoppingListGoToService: ShoppingListGoToService
    ) { }

    public goToEdit(): Observable<boolean> {
        this.isGoingToEdit = true;
        return this.shoppingListGoToService.goToUpdate(this.shoppingListId);
    }
}
