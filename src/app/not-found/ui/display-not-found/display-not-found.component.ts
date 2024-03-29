import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './display-not-found.component.html',
  styleUrls: ['./display-not-found.component.scss']
})
export class NotFoundComponent {
  public constructor(private router: Router) { }

  public goToRoot(): Promise<boolean> {
    return this.router.navigate(['']);
  }
}
