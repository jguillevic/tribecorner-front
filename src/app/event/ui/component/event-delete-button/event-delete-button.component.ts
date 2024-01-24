import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';

import {Event} from '../../../model/event.model';
import {Subject, takeUntil, tap} from 'rxjs';
import {EventApiService} from '../../../service/event-api.service';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MtxButtonModule} from '@ng-matero/extensions/button';

@Component({
  selector: 'app-event-delete-button',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MtxButtonModule
],
  templateUrl: './event-delete-button.component.html'
})
export class EventDeleteButtonComponent implements OnDestroy {
  @Input() public eventToDelete: Event|undefined;
  @Output() public onEventDeleted: EventEmitter<Event> = new EventEmitter<Event>();

  private readonly destroy$ = new Subject<void>();

  public isDeleting: boolean = false;

  public constructor(
    private eventApiService: EventApiService
  ) {}

  public ngOnDestroy(): void {
    this.destroy$.complete();
  }

  public delete() {
    if (this.eventToDelete && this.eventToDelete.id) {
      this.isDeleting = true;
      this.eventApiService.delete(this.eventToDelete.id)
      .pipe(
        takeUntil(this.destroy$),
        tap(() => 
          this.onEventDeleted.emit(this.eventToDelete)
        ),
        tap(() => this.isDeleting = false)
      )
      .subscribe({
        error: () => this.isDeleting = false
      });
    }
  }
}
