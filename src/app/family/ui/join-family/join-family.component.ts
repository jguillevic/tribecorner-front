import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FamilyService } from '../../service/family.service';
import { Router } from '@angular/router';
import { FamilyRoutes } from '../../route/family.routes';
import { Subscription, switchMap } from 'rxjs';
import { UserService } from 'src/app/user/service/user.service';
import { UserInfo } from 'src/app/user/model/user-info.model';
import { HomeRoutes } from 'src/app/home/route/home.routes';
import { ButtonWithSpinnerDirective } from 'src/app/common/button/directive/button-with-spinner.directive';
import { SignOutButtonComponent } from 'src/app/common/button/ui/sign-out/sign-out-button.component';
import { AssociationCodeNotFoundError } from '../../error/association-code-not-found.error';

@Component({
    selector: 'app-join-family',
    standalone: true,
    templateUrl: './join-family.component.html',
    styles: [],
    imports: [
        CommonModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        SignOutButtonComponent,
        ButtonWithSpinnerDirective,
        ReactiveFormsModule
    ]
})
export class JoinFamilyComponent implements OnInit, OnDestroy {
  private _joinSubscription: Subscription|undefined;

  private _currentUserInfo: UserInfo | undefined;
  public get currentUserInfo(): UserInfo | undefined {
    return this._currentUserInfo;
  }
  public set currentUserInfo(value: UserInfo | undefined) {
    this._currentUserInfo = value;
  }

  private _isJoiningFamily: boolean = false;
  public get isJoiningFamily(): boolean {
    return this._isJoiningFamily;
  }
  public set isJoiningFamily(value: boolean) {
    this._isJoiningFamily = value;
  }

  private _isGoingToCreateFamily: boolean = false;
  public get isGoingToCreateFamily(): boolean {
    return this._isGoingToCreateFamily;
  }
  public set isGoingToCreateFamily(value: boolean) {
    this._isGoingToCreateFamily = value;
  }

  // Formulaire.
  private readonly _joinFamilyForm: FormGroup = new FormGroup(
    {
      familyAssociationCode: new FormControl('', [Validators.required]),
    }
  );
  public get joinFamilyForm(): FormGroup {
    return this._joinFamilyForm;
  }

  public constructor(
    private router: Router,
    private familyService: FamilyService,
    private userService: UserService
    ) { }

  public ngOnInit(): void {
    this.currentUserInfo = this.userService.getCurrentUserInfo();
  }

  public ngOnDestroy(): void {
    this._joinSubscription?.unsubscribe();
  }

  private goToHome(): Promise<boolean> {
    return this.router.navigate([HomeRoutes.displayHomeRoute]);
  }

  private handleError(error: any): void {
    this.isJoiningFamily = false;

    if (error instanceof(AssociationCodeNotFoundError)) {
      this.joinFamilyForm.controls['familyAssociationCode'].setErrors({'notFound': true});
    } else {
      window.alert("Problème technique. Veuillez réessayer dans quelques minutes.");
    }
  }

  public joinFamily(): void {
    if (this.joinFamilyForm.valid) {
      this.isJoiningFamily = true;

      const familyAssociationCode: string = this.joinFamilyForm.controls['familyAssociationCode'].value;

      if (this.currentUserInfo) {
        this._joinSubscription = this.familyService.joinFamily(familyAssociationCode, this.currentUserInfo.id)
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

  public goToCreateFamily(): Promise<boolean> {
    this.isGoingToCreateFamily = true;
    return this.router.navigate([FamilyRoutes.createFamilyRoute]);
  }
}