import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-simple-loading',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './simple-loading.component.html',
  styleUrls: ['./simple-loading.component.scss']
})
export class SimpleLoadingComponent {

}
