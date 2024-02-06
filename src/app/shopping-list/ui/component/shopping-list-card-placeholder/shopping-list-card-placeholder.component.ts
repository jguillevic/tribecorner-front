import {Component, Input} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
import { PlaceholderItemComponent } from "../../../../common/placeholder/placeholder-item/placeholder-item.component";

@Component({
    selector: 'app-shopping-list-card-placeholder',
    standalone: true,
    templateUrl: './shopping-list-card-placeholder.component.html',
    styleUrl: `shopping-list-card-placeholder.component.scss`,
    imports: [
        MatCardModule,
        NgxSkeletonLoaderModule,
        PlaceholderItemComponent
    ]
})
export class ShoppingListCardPlaceholderComponent {
    @Input() public showActions: boolean = true;
}
