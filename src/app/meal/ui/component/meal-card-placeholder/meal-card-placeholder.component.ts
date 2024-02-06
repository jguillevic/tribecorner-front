import {Component, Input} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { PlaceholderItemComponent } from "../../../../common/placeholder/placeholder-item/placeholder-item.component";

@Component({
    selector: 'app-meal-card-placeholder',
    standalone: true,
    templateUrl: './meal-card-placeholder.component.html',
    styleUrl: '../common/meal-card.component.scss',
    imports: [
        MatCardModule,
        PlaceholderItemComponent
    ]
})
export class MealCardPlaceholderComponent {
    @Input() public showActions: boolean = true;
}
