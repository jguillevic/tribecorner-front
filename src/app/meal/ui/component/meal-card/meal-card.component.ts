import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Meal} from '../../../model/meal.model';
import {MatCardModule} from '@angular/material/card';
import {MealEditButtonComponent} from "../meal-edit-button/meal-edit-button.component";
import {MealCopyButtonComponent} from "../meal-copy-button/meal-copy-button.component";
import {MealDeleteButtonComponent} from "../meal-delete-button/meal-delete-button.component";

@Component({
    selector: 'app-meal-card',
    standalone: true,
    templateUrl: './meal-card.component.html',
    styleUrl: '../common/meal-card.component.scss',
    imports: [
        MatCardModule,
        MealEditButtonComponent,
        MealCopyButtonComponent,
        MealDeleteButtonComponent
    ]
})
export class MealCardComponent {
    @Input() public meal: Meal|undefined;
    @Input() public showActions: boolean = true;
    @Output() public onMealCopied: EventEmitter<Meal> = new EventEmitter<Meal>();
    @Output() public onMealDeleted: EventEmitter<Meal> = new EventEmitter<Meal>();

    public mealCopied(meal: Meal): void {
        this.onMealCopied.emit(meal);
    }

    public mealDeleted(meal: Meal): void {
        this.onMealDeleted.emit(meal);
    }
}
