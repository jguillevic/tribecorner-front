import {Component, Input} from '@angular/core';
import {Meal} from '../../../model/meal.model';
import {MatCardModule} from '@angular/material/card';

@Component({
    selector: 'app-meal-card',
    standalone: true,
    imports: [
        MatCardModule
    ],
    templateUrl: './meal-card.component.html',
    styleUrl: 'meal-card.component.scss'
})
export class MealCardComponent {
    @Input() public meal: Meal|undefined;
    @Input() public showActions: boolean = true;
}
