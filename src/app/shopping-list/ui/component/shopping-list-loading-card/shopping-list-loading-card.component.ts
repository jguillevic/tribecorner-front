import {Component, Input} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';

@Component({
    selector: 'app-shopping-list-loading-card',
    standalone: true,
    imports: [
        MatCardModule,
        NgxSkeletonLoaderModule
    ],
    templateUrl: './shopping-list-loading-card.component.html',
    styleUrl: `shopping-list-loading-card.component.scss`
})
export class ShoppingListLoadingCardComponent {
    @Input() public showActions: boolean = true;
}
