import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-go-back-top-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './go-back-top-bar.component.html',
  styles: [
  ]
})
export class GoBackTopBarComponent {
  public constructor(private location: Location) { }

  public goBack(): void {
    this.location.back();
  }
}
