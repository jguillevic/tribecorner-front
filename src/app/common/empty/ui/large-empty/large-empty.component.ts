import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-large-empty',
  standalone: true,
  imports: [],
  templateUrl: './large-empty.component.html',
  styleUrls: ['./large-empty.component.scss']
})
export class LargeEmptyComponent {
  @Input() public illustrationSource: string = '';
  @Input() public title: string = '';
  @Input() public message: string = '';
}
