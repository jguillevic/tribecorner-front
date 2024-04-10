import {Component, OnDestroy, Signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileTopBarComponent} from "../../../../common/top-bar/profile/ui/profile-top-bar.component";
import {TabBarComponent} from "../../../../common/tab-bar/ui/tab-bar/tab-bar.component";
import {InlineCalendarComponent} from "../../../../common/calendar/ui/component/inline-calendar/inline-calendar.component";
import {Observable, Subject, switchMap, take} from 'rxjs';
import {MealsByMealKind} from '../../../model/meals-by-meal-kind.model';
import {MealsByMealKindService} from '../../../service/meals-by-meal-kind.service';
import {LargeEmptyComponent} from "../../../../common/empty/ui/large-empty/large-empty.component";
import {MealCurrentDateService} from '../../../service/meal-current-date.service';
import {MealCardComponent} from "../../component/meal-card/meal-card.component";
import {MealEditButtonComponent} from "../../component/meal-edit-button/meal-edit-button.component";
import {MealDeleteButtonComponent} from "../../component/meal-delete-button/meal-delete-button.component";
import {MealCopyButtonComponent} from "../../component/meal-copy-button/meal-copy-button.component";
import {MealGoToService} from '../../../service/meal-go-to.service';
import {MealLargeEmptyComponent} from "../../component/meal-large-empty/meal-large-empty.component";
import {toSignal} from '@angular/core/rxjs-interop';
import {MealsByMealKindComponent } from "../../component/meals-by-meal-kind/meals-by-meal-kind.component";
import {MealsByMealKindPlaceholderComponent} from "../../component/meals-by-meal-kind-placeholder/meals-by-meal-kind-placeholder.component";

@Component({
    selector: 'app-display-meals-page',
    standalone: true,
    templateUrl: './display-meals-page.component.html',
    styleUrl: 'display-meals-page.component.scss',
    imports: [
        CommonModule,
        ProfileTopBarComponent,
        TabBarComponent,
        InlineCalendarComponent,
        LargeEmptyComponent,
        MealCardComponent,
        MealEditButtonComponent,
        MealDeleteButtonComponent,
        MealCopyButtonComponent,
        MealLargeEmptyComponent,
        MealsByMealKindComponent,
        MealsByMealKindPlaceholderComponent
    ]
})
export class DisplayMealsPageComponent implements OnDestroy {
    private readonly destroy$: Subject<void> = new Subject<void>();
    private readonly selectedDate$: Observable<Date> = this.mealCurrentDateService.currentDate$;

    public readonly defaultDate$: Observable<Date> = this.selectedDate$
    .pipe(
        take(1)
    );

    private mealsByMealKinds$: Observable<MealsByMealKind[]> 
    = this.getMealsByMealKinds$();
    public mealsByMealKinds: Signal<MealsByMealKind[]|undefined>
    = toSignal(this.mealsByMealKinds$);

    public constructor(
        private readonly mealsByMealKindService: MealsByMealKindService,
        private readonly mealCurrentDateService: MealCurrentDateService,
        private readonly mealGoToService: MealGoToService
    ) { }

    public ngOnDestroy(): void {
        this.destroy$.next();
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
            switchMap(date => this.mealsByMealKindService.loadAllByDate(date))
        );
    }

    public trackByMealsByMealKind(mealsByMealKind: MealsByMealKind) {
        return mealsByMealKind.mealKind.id;
    }
}