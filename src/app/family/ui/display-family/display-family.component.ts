import {Component, OnDestroy, OnInit} from '@angular/core';
import {FamilyApiService} from '../../service/family-api.service';
import {Observable} from 'rxjs';
import {Family} from '../../model/family.model';
import {TabBarComponent} from "../../../common/tab-bar/ui/tab-bar/tab-bar.component";
import {ProfileTopBarComponent} from '../../../common/top-bar/profile/ui/profile-top-bar.component';
import {GoBackTopBarComponent} from "../../../common/top-bar/go-back/ui/go-back-top-bar.component";
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-display-family',
    standalone: true,
    templateUrl: './display-family.component.html',
    styleUrl: './display-family.component.scss',
    imports: [
      TabBarComponent,
      ProfileTopBarComponent,
      GoBackTopBarComponent,
      CommonModule
    ]
})
export class DisplayFamilyComponent {
  public readonly family$: Observable<Family|undefined> = this.familyApiService.family$;

  public constructor(
    private familyApiService: FamilyApiService
  ) { }
}
