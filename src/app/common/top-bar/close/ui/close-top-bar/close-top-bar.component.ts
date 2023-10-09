import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-close-top-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './close-top-bar.component.html',
  styles: [
  ]
})
export class CloseTopBarComponent {
  @Output() public onCloseClicked: EventEmitter<void> = new EventEmitter();

  public close(): void {
    this.onCloseClicked.emit();
  }
}
