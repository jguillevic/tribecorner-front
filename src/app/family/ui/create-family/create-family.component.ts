import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {Subscription, switchMap} from 'rxjs';
import {FamilyApiService} from '../../service/family-api.service';
import {Router} from '@angular/router';
import {FamilyRoutes} from '../../route/family.routes';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {HomeRoutes} from '../../../home/route/home.routes';
import {UserInfo} from '../../../user/model/user-info.model';
import {UserService} from '../../../user/service/user.service';
import {SignOutButtonComponent} from '../../../common/button/ui/sign-out/sign-out-button.component';
import {MtxButtonModule} from '@ng-matero/extensions/button';

@Component({
    selector: 'app-create-family',
    standalone: true,
    templateUrl: './create-family.component.html',
    styles: [],
    imports: [
        CommonModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        SignOutButtonComponent,
        ReactiveFormsModule,
        MtxButtonModule
    ]
})
export class CreateFamilyComponent implements OnInit, OnDestroy {
  private createSubscription: Subscription|undefined;

  public currentUserInfo: UserInfo | undefined;
  public isCreatingFamily: boolean = false;
  public isGoingToJoinFamily: boolean = false;

  // Formulaire.
  public readonly familyNameMaxLength: number = 255; 

  public readonly createFamilyForm: FormGroup = new FormGroup(
    {
      familyName: new FormControl('', [Validators.required, Validators.maxLength(this.familyNameMaxLength)]),
    }
  );

  public constructor(
    private router: Router,
    private familyApiService: FamilyApiService,
    private userService: UserService
  ) { }

  public ngOnInit(): void {
    this.currentUserInfo = this.userService.getCurrentUserInfo();
  }

  public ngOnDestroy(): void {
    this.createSubscription?.unsubscribe();
  }

  private goToHome(): Promise<boolean> {
    return this.router.navigate([HomeRoutes.displayHomeRoute]);
  }

  private handleError(error: any): void {
    this.isCreatingFamily = false;
    window.alert("Problème technique. Veuillez réessayer dans quelques minutes.");
  }

  public createFamily(): void {
    if (this.createFamilyForm.valid) {
      this.isCreatingFamily = true;   

      const familyName: string = this.createFamilyForm.controls['familyName'].value;

      if (this.currentUserInfo) {
        this.createSubscription = this.familyApiService
        .create(familyName, this.currentUserInfo.id)
        .pipe(
          switchMap(() => {
            return this.userService.refreshCurrentUser();
          })
        )
        .subscribe({
          next: () => this.goToHome(),
          error: (error) => this.handleError(error)
        });
      }
    }
  }

  public goToJoinFamily(): Promise<boolean> {
    this.isGoingToJoinFamily = true;
    return this.router.navigate([FamilyRoutes.joinFamilyRoute]);
  }
}