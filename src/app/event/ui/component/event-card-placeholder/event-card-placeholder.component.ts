import {Component, Input} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
import { PlaceholderItemComponent } from "../../../../common/placeholder/placeholder-item/placeholder-item.component";

@Component({
    selector: 'app-event-card-placeholder',
    standalone: true,
    templateUrl: './event-card-placeholder.component.html',
    styleUrl: '../common/event-card.component.scss',
    imports: [
        MatCardModule,
        NgxSkeletonLoaderModule,
        PlaceholderItemComponent
    ]
})
export class EventCardPlaceholderComponent {
    @Input() showActions: boolean = true;
}
