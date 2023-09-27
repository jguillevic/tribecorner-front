import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileTopBarComponent } from "../../../common/profile-top-bar/ui/profile-top-bar/profile-top-bar.component";
import { TabBarComponent } from "../../../common/tab-bar/ui/tab-bar/tab-bar.component";

@Component({
    selector: 'app-display-user',
    standalone: true,
    templateUrl: './display-user.component.html',
    styles: [],
    imports: [CommonModule, ProfileTopBarComponent, TabBarComponent]
})
export class DisplayUserComponent {

}
