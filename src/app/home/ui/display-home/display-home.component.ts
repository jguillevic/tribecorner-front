import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../service/home.service';
import { Router } from '@angular/router';
import { TabBarComponent } from 'src/app/common/tab-bar/ui/tab-bar/tab-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-display-home',
  standalone: true,
  imports: [
    CommonModule,
    TabBarComponent,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './display-home.component.html',
  styles: [
  ]
})
export class DisplayHomeComponent implements OnInit {
  public constructor(private homeService: HomeService, private router: Router) { }

  public ngOnInit(): void {
    // Chargement de la famille à partir des infos de l'utilsateur authentifié.
    // Si pas de famille -> Proposition uniquement d'en créer une ou d'en rejoindre une via code.
    // Si déjà une famille -> Afficher les autres membres et proposer d'accéder à la liste, ...
  }
}
