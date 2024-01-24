import { Component, EventEmitter, Input, Output } from '@angular/core';

import { SimpleLoadingComponent } from "../../../../common/loading/ui/simple-loading/simple-loading.component";
import { TranslocoModule, provideTranslocoScope } from '@ngneat/transloco';

@Component({
  selector: 'app-home-category',
  standalone: true,
  templateUrl: './home-category.component.html',
  styleUrls: ['./home-category.component.scss'],
  imports: [
    SimpleLoadingComponent,
    TranslocoModule
],
  providers: [
    provideTranslocoScope({scope: 'home/ui/component/home-category', alias: 'homeCategory'})
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
