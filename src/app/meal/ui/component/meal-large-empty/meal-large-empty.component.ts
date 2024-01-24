import {Component} from '@angular/core';

import {LargeEmptyComponent} from "../../../../common/empty/ui/large-empty/large-empty.component";
import {MatButtonModule} from '@angular/material/button';
import {Observable} from 'rxjs';
import {MealGoToService} from '../../../service/meal-go-to.service';
import {TranslocoModule, provideTranslocoScope} from '@ngneat/transloco';

@Component({
    selector: 'app-meal-large-empty',
    standalone: true,
    templateUrl: './meal-large-empty.component.html',
    styles: [],
    imports: [
    LargeEmptyComponent,
    MatButtonModule,
    TranslocoModule
],
    providers: [
        provideTranslocoScope({scope: 'meal/ui/component/meal-large-empty', alias: 'mealLargeEmpty'})
    ]
})
export class MealLargeEmptyComponent {
    public constructor(
        private readonly mealGoToService: MealGoToService
    ) { }

    public goToCreate(): Observable<boolean> {
        return this.mealGoToService.goToCreate();
    }
}
