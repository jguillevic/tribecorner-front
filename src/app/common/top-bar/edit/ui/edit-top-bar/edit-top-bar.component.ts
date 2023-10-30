import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MtxButtonModule } from '@ng-matero/extensions/button';

@Component({
  selector: 'app-edit-top-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MtxButtonModule
  ],
  templateUrl: './edit-top-bar.component.html',
  styles: [
  ]
})
export class EditTopBarComponent {
  @Input() public title: string = '';
  @Input() public isSaving: boolean = false;
  @Input() public isClosing: boolean = false;
  @Output() public onCloseClicked: EventEmitter<void> = new EventEmitter();
  @Output() public onSaveClicked: EventEmitter<void> = new EventEmitter();

  public close(): void {
    this.onCloseClicked.emit();
  }

  public save(): void {
    this.onSaveClicked.emit();
  }
}
