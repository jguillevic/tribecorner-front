import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MealsByMealKind} from '../../../model/meals-by-meal-kind.model';
import {MealCardComponent} from "../meal-card/meal-card.component";
import {Meal} from 'src/app/meal/model/meal.model';

@Component({
    selector: 'app-meals-by-meal-kind',
    standalone: true,
    templateUrl: './meals-by-meal-kind.component.html',
    styleUrl: '../common/meals-by-meal-kind.component.scss',
    imports: [MealCardComponent]
})
export class MealsByMealKindComponent {
    @Input() showActions: boolean = true;
    @Input() mealsByMealKind: MealsByMealKind|undefined;
    @Output() public onMealCopied: EventEmitter<Meal> = new EventEmitter<Meal>();
    @Output() public onMealDeleted: EventEmitter<Meal> = new EventEmitter<Meal>();

    public mealCopied(meal: Meal): void {
        this.onMealCopied.emit(meal);
    }

    public mealDeleted(meal: Meal): void {
        this.onMealDeleted.emit(meal);
    }
}
