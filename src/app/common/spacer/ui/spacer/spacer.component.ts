import {CommonModule} from '@angular/common';
import {Component, InputSignal, input} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {Observable, combineLatest, map} from 'rxjs';

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
  public readonly gap: InputSignal<number> = input<number>(15);
  public readonly direction: InputSignal<'horizontal'|'vertical'> = input<'horizontal'|'vertical'>('vertical');

  private readonly gap$: Observable<number> = toObservable<number>(this.gap);
  private readonly direction$: Observable<'horizontal'|'vertical'> = toObservable(this.direction);

  public readonly style$
  = combineLatest(
    {
      gap: this.gap$,
      direction: this.direction$
    }
  )
  .pipe(
    map(result => `${result.direction == 'horizontal' ? 'width' : 'height'}:${result.gap}px;`)
  )
}
