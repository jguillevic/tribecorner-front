import {Component, Input} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';

@Component({
    selector: 'app-shopping-list-card-placeholder',
    standalone: true,
    imports: [
        MatCardModule,
        NgxSkeletonLoaderModule
    ],
    templateUrl: './shopping-list-card-placeholder.component.html',
    styleUrl: `shopping-list-card-placeholder.component.scss`
})
export class ShoppingListCardPlaceholderComponent {
    @Input() public showActions: boolean = true;
}
