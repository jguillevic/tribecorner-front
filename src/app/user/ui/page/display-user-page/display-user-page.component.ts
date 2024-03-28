import {Component, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TabBarComponent} from "../../../../common/tab-bar/ui/tab-bar/tab-bar.component";
import {ProfileTopBarComponent} from 'src/app/common/top-bar/profile/ui/profile-top-bar.component';
import {GoBackTopBarComponent} from "../../../../common/top-bar/go-back/ui/go-back-top-bar.component";
import {UserService} from '../../../service/user.service';
import {UserInfo} from '../../../model/user-info.model';
import {Observable, Subject, takeUntil} from 'rxjs';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCardModule} from '@angular/material/card';

@Component({
    selector: 'app-display-user-page',
    standalone: true,
    templateUrl: './display-user-page.component.html',
    styleUrl: './display-user-page.component.scss',
    imports: [
        ProfileTopBarComponent,
        TabBarComponent,
        GoBackTopBarComponent,
        CommonModule,
        MatDividerModule,
        MatListModule,
        MatIconModule,
        MatSlideToggleModule,
        MatCardModule
    ]
})
export class DisplayUserComponent implements OnDestroy {
    private readonly destroy$: Subject<void> = new Subject<void>();

    public readonly userInfo$: Observable<UserInfo|undefined>
    = this.userService.userInfo$;

    public constructor(
        private readonly userService: UserService
    ) { }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public signOut(): void {
        this.userService
        .signOut()
        .pipe(
            takeUntil(this.destroy$)
        )
        .subscribe();
    }
}
