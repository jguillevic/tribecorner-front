import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from '../../../model/event.model';
import { Subject, takeUntil, tap } from 'rxjs';
import { EventService } from '../../../service/event.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MtxButtonModule } from '@ng-matero/extensions/button';

@Component({
  selector: 'app-event-delete-button',
  standalone: true,
  imports: [
    CommonModule,
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
    private eventService: EventService
  ) { }

  public ngOnDestroy(): void {
    this.destroy$.complete();
  }

  public delete() {
    if (this.eventToDelete && this.eventToDelete.id) {
      this.isDeleting = true;
      this.eventService.delete(this.eventToDelete.id)
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
