import { Component } from '@angular/core';

import { LargeEmptyComponent } from "../../../../common/empty/ui/large-empty/large-empty.component";
import { TranslocoModule, provideTranslocoScope } from '@ngneat/transloco';

@Component({
    selector: 'app-event-large-empty',
    standalone: true,
    templateUrl: './event-large-empty.component.html',
    styles: [],
    imports: [
    LargeEmptyComponent,
    TranslocoModule
],
    providers: [
        provideTranslocoScope({scope: 'event/ui/component/event-large-empty', alias: 'eventLargeEmpty'})
    ]
})
export class EventLargeEmptyComponent {
}
