import {CommonModule} from '@angular/common';
import {Component, InputSignal, input} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';

@Component({
  selector: 'app-spacer',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './spacer.component.html',
  styles: ``
})
export class SpacerComponent {
  public readonly height: InputSignal<number> = input<number>(15);

  public readonly style$ = toObservable(this.height)
  .pipe(
    map(height => `height:${height}px;`)
  )
}
