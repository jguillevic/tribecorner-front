import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeToString',
  standalone: true
})
export class TimeToStringPipe implements PipeTransform {
  transform(time: number): string {
    const hours: string = (Math.floor(time / 60)).toString().padStart(2, '0');
    const minutes: string = (time % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
