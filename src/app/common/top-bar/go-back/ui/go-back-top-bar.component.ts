import {Component} from '@angular/core';
import {Location} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-go-back-top-bar',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDividerModule
],
  templateUrl: './go-back-top-bar.component.html',
  styleUrls: ['go-back-top-bar.component.scss']
})
export class GoBackTopBarComponent {
  public isGoingBack: boolean = false;

  public constructor(
    private location: Location
  ) { }

  public goBack(): void {
    this. isGoingBack = true;
    this.location.back();
  }
}
