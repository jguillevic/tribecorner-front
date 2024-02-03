import {Component, Input} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';

@Component({
    selector: 'app-event-card-placeholder',
    standalone: true,
    imports: [
        MatCardModule,
        NgxSkeletonLoaderModule
    ],
    templateUrl: './event-card-placeholder.component.html',
    styleUrl: '../common/event-card.component.scss'
})
export class EventCardPlaceholderComponent {
    @Input() showActions: boolean = true;
}
