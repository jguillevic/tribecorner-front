import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-top-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './edit-top-bar.component.html',
  styles: [
  ]
})
export class EditTopBarComponent {
  private _onCloseClicked: EventEmitter<void> = new EventEmitter();
  public get onCloseClicked(): EventEmitter<void> {
    return this._onCloseClicked;
  }
  @Output() public set onCloseClicked(value: EventEmitter<void>) {
    this._onCloseClicked = value;
  }

  private _onSaveClicked: EventEmitter<void> = new EventEmitter();
  public get onSaveClicked(): EventEmitter<void> {
    return this._onSaveClicked;
  }
  @Output() public set onSaveClicked(value: EventEmitter<void>) {
    this._onSaveClicked = value;
  }

  public close(): void {
    this.onCloseClicked.emit();
  }

  public save(): void {
    this.onSaveClicked.emit();
  }
}
