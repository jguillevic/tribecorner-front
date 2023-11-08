import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoBackTopBarComponent } from "../../../common/top-bar/go-back/ui/go-back-top-bar.component";

@Component({
    selector: 'app-edit-event',
    standalone: true,
    templateUrl: './edit-event.component.html',
    imports: [CommonModule, GoBackTopBarComponent]
})
export class EditEventComponent {

}
