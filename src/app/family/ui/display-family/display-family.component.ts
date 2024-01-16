import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserInfo} from 'src/app/user/model/user-info.model';
import {UserService} from 'src/app/user/service/user.service';
import {FamilyApiService} from '../../service/family-api.service';
import {Subscription} from 'rxjs';
import {Family} from '../../model/family.model';
import {TabBarComponent} from "../../../common/tab-bar/ui/tab-bar/tab-bar.component";
import {ProfileTopBarComponent} from '../../../common/top-bar/profile/ui/profile-top-bar.component';
import {GoBackTopBarComponent} from "../../../common/top-bar/go-back/ui/go-back-top-bar.component";

@Component({
    selector: 'app-display-family',
    standalone: true,
    templateUrl: './display-family.component.html',
    styles: [],
    imports: [CommonModule, TabBarComponent, ProfileTopBarComponent, GoBackTopBarComponent]
})
export class DisplayFamilyComponent implements OnInit, OnDestroy {
  private loadFamilySubscription: Subscription|undefined;

  public family: Family|undefined;

  public constructor(
    private userService: UserService,
    private familyApiService: FamilyApiService
    ) { }

  public ngOnInit(): void {
    const currentUserInfo: UserInfo|undefined = this.userService.getCurrentUserInfo();
    if (currentUserInfo && currentUserInfo.familyId) {
      this.loadFamilySubscription = this.familyApiService
      .loadOneByFamilyId(currentUserInfo.familyId)
      .subscribe((family) => { this.family = family; });
    }
  }

  public ngOnDestroy(): void {
    this.loadFamilySubscription?.unsubscribe();
  }
}
