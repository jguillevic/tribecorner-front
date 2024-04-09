import {Component, Input} from '@angular/core';
import {MealsByMealKind} from '../../../model/meals-by-meal-kind.model';
import {MealCardComponent} from "../meal-card/meal-card.component";
import {Meal} from '../../../model/meal.model';

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

    public trackByMeal(meal: Meal) {
        return meal.id;
    }
}
