import { Component, Input } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router';
import { EventRoutes } from '../../../route/event.routes';

@Component({
  selector: 'app-event-edit-button',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MtxButtonModule
],
  templateUrl: './event-edit-button.component.html',
  styles: [
  ]
})
export class EventEditButtonComponent {
  @Input() public eventId: number = 0;

  public isGoingToEdit: boolean = false;

  public constructor(
    private router: Router
  ) { }

  public goToEdit(): Observable<boolean> {
    this.isGoingToEdit = true;
    return from(this.router.navigate([EventRoutes.editEventRoute], { queryParams: { id: this.eventId } }));
  }
}