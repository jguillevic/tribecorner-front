import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Subscription, switchMap } from 'rxjs';
import { FamilyService } from '../../service/family.service';
import { Router } from '@angular/router';
import { FamilyRoutes } from '../../route/family.routes';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HomeRoutes } from 'src/app/home/route/home.routes';
import { UserInfo } from 'src/app/user/model/user-info.model';
import { UserService } from 'src/app/user/service/user.service';
import { ButtonWithSpinnerDirective } from 'src/app/common/button/directive/button-with-spinner.directive';
import { SignOutButtonComponent } from 'src/app/common/button/ui/sign-out/sign-out-button.component';
import { HttpErrorResponse } from '@angular/common/http';

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
        ButtonWithSpinnerDirective,
        ReactiveFormsModule
    ]
})
export class CreateFamilyComponent implements OnInit, OnDestroy {
  private _createSubscription: Subscription|undefined;

  private _currentUserInfo: UserInfo | undefined;
  public get currentUserInfo(): UserInfo | undefined {
    return this._currentUserInfo;
  }
  public set currentUserInfo(value: UserInfo | undefined) {
    this._currentUserInfo = value;
  }

  private _isCreatingFamily: boolean = false;
  public get isCreatingFamily(): boolean {
    return this._isCreatingFamily;
  }
  public set isCreatingFamily(value: boolean) {
    this._isCreatingFamily = value;
  }
  private _isGoingToJoinFamily: boolean = false;
  public get isGoingToJoinFamily(): boolean {
    return this._isGoingToJoinFamily;
  }
  public set isGoingToJoinFamily(value: boolean) {
    this._isGoingToJoinFamily = value;
  }

  // Formulaire.
  private readonly _familyNameLength: number = 255; 
  public get familyNameMaxLength(): number {
    return this._familyNameLength;
  }

  private readonly _createFamilyForm: FormGroup = new FormGroup(
    {
      familyName: new FormControl('', [Validators.required, Validators.maxLength(this.familyNameMaxLength)]),
    }
  );
  public get createFamilyForm(): FormGroup {
    return this._createFamilyForm;
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
    this._createSubscription?.unsubscribe();
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
        this._createSubscription = this.familyService
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