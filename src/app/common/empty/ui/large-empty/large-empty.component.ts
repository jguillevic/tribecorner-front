import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-large-empty',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './large-empty.component.html',
  styles: [
  ]
})
export class LargeEmptyComponent {
  @Input() public illustrationSource: string = '';
  @Input() public title: string = '';
  @Input() public message: string = '';
}
