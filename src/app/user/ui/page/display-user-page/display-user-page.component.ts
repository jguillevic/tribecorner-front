import { Component } from '@angular/core';

import { TabBarComponent } from "../../../../common/tab-bar/ui/tab-bar/tab-bar.component";
import { ProfileTopBarComponent } from 'src/app/common/top-bar/profile/ui/profile-top-bar.component';
import { GoBackTopBarComponent } from "../../../../common/top-bar/go-back/ui/go-back-top-bar.component";

@Component({
    selector: 'app-display-user-page',
    standalone: true,
    templateUrl: './display-user-page.component.html',
    styles: [],
    imports: [ProfileTopBarComponent, TabBarComponent, GoBackTopBarComponent]
})
export class DisplayUserComponent {

}
