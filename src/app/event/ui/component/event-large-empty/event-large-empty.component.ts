import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LargeEmptyComponent } from "../../../../common/empty/ui/large-empty/large-empty.component";

@Component({
    selector: 'app-event-large-empty',
    standalone: true,
    templateUrl: './event-large-empty.component.html',
    styles: [],
    imports: [CommonModule, LargeEmptyComponent]
})
export class EventLargeEmptyComponent {
}
