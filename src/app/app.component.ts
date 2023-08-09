import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    template: `<h1>Welcome to {{title}}!</h1>
<router-outlet></router-outlet>`,
    styles: [],
    standalone: true,
    imports: [RouterOutlet]
})
export class AppComponent {
  title = 'ng-familyhub-app';
}
