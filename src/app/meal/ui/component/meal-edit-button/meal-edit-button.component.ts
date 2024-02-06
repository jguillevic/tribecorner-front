import {Component, Input} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MtxButtonModule} from '@ng-matero/extensions/button';
import {Observable, of} from 'rxjs';
import {MealGoToService} from '../../../service/meal-go-to.service';

@Component({
    selector: 'app-meal-edit-button',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MtxButtonModule
    ],
    templateUrl: './meal-edit-button.component.html',
    styles: [
    ]
})
export class MealEditButtonComponent {
    @Input() public mealId: number|undefined = undefined;

    public isGoingToEdit: boolean = false;

    public constructor(
        private mealGoToService: MealGoToService
    ) { }

    public goToEdit(): Observable<boolean> {
        if (this.mealId) {
            this.isGoingToEdit = true;
            return this.mealGoToService.goToUpdate(this.mealId);
        }
        return of(true);
    }
}
