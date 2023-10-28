import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleLoadingComponent } from "../../../common/loading/ui/simple-loading/simple-loading.component";

@Component({
    selector: 'app-home-category',
    standalone: true,
    templateUrl: './home-category.component.html',
    styles: [],
    imports: [
        CommonModule,
        SimpleLoadingComponent
    ]
})
export class HomeCategoryComponent {
  @Input() public categoryName: string | undefined;
  @Input() public isEmpty: boolean = false;
  @Input() public isLoading: boolean = false;

  @Output()public onSeeAllClicked: EventEmitter<void> = new EventEmitter();

  public seeAll(): void {
    this.onSeeAllClicked.emit();
  }
}
