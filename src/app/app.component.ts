import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {PushNotificationComponent} from "./notification/ui/component/push-notification/push-notification.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styles: [],
    standalone: true,
    imports: [
        RouterOutlet,
        PushNotificationComponent
    ]
})
export class AppComponent { }
