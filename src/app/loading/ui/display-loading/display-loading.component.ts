import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../../user/service/user.service';
import {Router} from '@angular/router';
import {UserRoutes} from '../../../user/route/user.routes';
import {FamilyRoutes} from '../../../family/route/family.routes';
import {Observable, Subject, from, mergeMap, of, takeUntil} from 'rxjs';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-display-loading',
  standalone: true,
  imports: [
    MatCardModule
  ],
  templateUrl: './display-loading.component.html',
  styleUrl: 'display-loading.component.scss'
})
export class DisplayLoadingComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  public constructor(
    private userService: UserService,
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.userService.isSignedIn$
    .pipe(
      takeUntil(this.destroy$),
      mergeMap((isSignedIn: boolean | undefined) => {
        if (isSignedIn !== undefined) {
            this.navigateTo(isSignedIn);
        }
        return of(undefined);
      })
    )
    .subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private navigateTo(isSignedIn: boolean) : Observable<boolean> {
    if (isSignedIn) {
      return from(this.router.navigate([FamilyRoutes.createFamilyRoute]));
    }
    return from(this.router.navigate([UserRoutes.signInUserRoute]));
  }
}