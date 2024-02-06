import { Component, Input } from '@angular/core';
import { MealCardPlaceholderComponent } from "../meal-card-placeholder/meal-card-placeholder.component";
import { PlaceholderItemComponent } from "../../../../common/placeholder/placeholder-item/placeholder-item.component";

@Component({
    selector: 'app-meals-by-meal-kind-placeholder',
    standalone: true,
    templateUrl: './meals-by-meal-kind-placeholder.component.html',
    styleUrl: '../common/meals-by-meal-kind.component.scss',
    imports: [MealCardPlaceholderComponent, PlaceholderItemComponent]
})
export class MealsByMealKindPlaceholderComponent {
    @Input() showActions: boolean = true;
}
