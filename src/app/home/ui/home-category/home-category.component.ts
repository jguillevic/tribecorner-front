import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home-category',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './home-category.component.html',
  styles: [
  ]
})
export class HomeCategoryComponent {
  private _categoryName: string | undefined;
  public get categoryName(): string | undefined {
    return this._categoryName;
  }
  @Input() public set categoryName(value: string | undefined) {
    this._categoryName = value;
  }

  private _isEmpty: boolean = true;
  public get isEmpty(): boolean {
    return this._isEmpty;
  }
  @Input() public set isEmpty(value: boolean) {
    this._isEmpty = value;
  }

  private _isLoading: boolean = true;
  public get isLoading(): boolean {
    return this._isLoading;
  }
  @Input() public set isLoading(value: boolean) {
    this._isLoading = value;
  }

  private _onSeeAllClicked: EventEmitter<void> = new EventEmitter();
  public get onSeeAllClicked(): EventEmitter<void> {
    return this._onSeeAllClicked;
  }
  @Output() public set onSeeAllClicked(value: EventEmitter<void>) {
    this._onSeeAllClicked = value;
  }

  public seeAll(): void {
    this.onSeeAllClicked.emit();
  }
}
