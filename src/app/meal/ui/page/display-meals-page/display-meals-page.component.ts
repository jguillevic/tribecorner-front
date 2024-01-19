import {Component, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileTopBarComponent} from "../../../../common/top-bar/profile/ui/profile-top-bar.component";
import {TabBarComponent} from "../../../../common/tab-bar/ui/tab-bar/tab-bar.component";
import {InlineCalendarComponent} from "../../../../common/calendar/ui/component/inline-calendar/inline-calendar.component";
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {BehaviorSubject, Observable, Subject, combineLatest, switchMap, take, tap} from 'rxjs';
import {MealsByMealKind} from '../../../model/meals-by-meal-kind.model';
import {MealsByMealKindService} from '../../../service/meals-by-meal-kind.service';
import {SimpleLoadingComponent} from "../../../../common/loading/ui/simple-loading/simple-loading.component";
import {LargeEmptyComponent} from "../../../../common/empty/ui/large-empty/large-empty.component";
import {MtxButtonModule} from '@ng-matero/extensions/button';
import {MealCurrentDateService} from '../../../service/meal-current-date.service';
import {LargeMealCardComponent} from "../../component/large-meal-card/large-meal-card.component";
import {MealEditButtonComponent} from "../../component/meal-edit-button/meal-edit-button.component";
import {MealDeleteButtonComponent} from "../../component/meal-delete-button/meal-delete-button.component";
import {Meal} from '../../../model/meal.model';
import {MealCopyButtonComponent} from "../../component/meal-copy-button/meal-copy-button.component";
import {MealGoToService} from 'src/app/meal/service/meal-go-to.service';

@Component({
    selector: 'app-display-meals-page',
    standalone: true,
    templateUrl: './display-meals-page.component.html',
    styleUrls: ['display-meals-page.component.scss'],
    imports: [
        CommonModule,
        ProfileTopBarComponent,
        TabBarComponent,
        InlineCalendarComponent,
        MatIconModule,
        MatButtonModule,
        SimpleLoadingComponent,
        LargeEmptyComponent,
        MtxButtonModule,
        LargeMealCardComponent,
        MealEditButtonComponent,
        MealDeleteButtonComponent,
        MealCopyButtonComponent
    ]
})
export class DisplayMealsPageComponent implements OnDestroy {
    private readonly destroy$: Subject<void> = new Subject<void>();
    private readonly selectedDate$: Observable<Date> = this.mealCurrentDateService.currentDate$;
    
    public isLoading: boolean = false;

    public readonly defaultDate$: Observable<Date> = this.selectedDate$
    .pipe(
        take(1)
    );

    public mealsByMealKinds$: Observable<MealsByMealKind[]> 
    = this.getMealsByMealKinds$();

    public constructor(
        private readonly mealsByMealKindService: MealsByMealKindService,
        private readonly mealCurrentDateService: MealCurrentDateService,
        private readonly mealGoToService: MealGoToService
    ) { }

    public ngOnDestroy(): void {
        this.destroy$.complete();
    }

    public onSelectedDateChanged(date: Date) {
        this.mealCurrentDateService.selectDate(date);
    }

    public goToCreate(): Observable<boolean> {
        return this.mealGoToService.goToCreate();
    }

    public goToUpdate(mealId: number|undefined): Observable<boolean> {
        return this.mealGoToService.goToUpdate(mealId);
    }

    private getMealsByMealKinds$(): Observable<MealsByMealKind[]> {
        return this.selectedDate$
        .pipe(
        tap(() => this.isLoading = true),
        switchMap(date => this.mealsByMealKindService.loadAllByDate(date)),
        tap(() => this.isLoading = false)
        );
    }

    public onMealDeleted(deletedMeal: Meal) {
        this.mealsByMealKinds$ = this.getMealsByMealKinds$();
    }

    public onMealCopied(copiedMeal: Meal) {
        this.mealGoToService.goToUpdate(copiedMeal.id);
    }
}