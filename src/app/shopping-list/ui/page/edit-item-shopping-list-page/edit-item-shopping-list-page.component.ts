import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoBackTopBarComponent } from "../../../../common/top-bar/go-back/ui/go-back-top-bar.component";
import { EditItemShoppingListFormComponent } from "../../component/edit-item-shopping-list-form/edit-item-shopping-list-form.component";
import { ItemShoppingListApiService } from '../../../service/item-shopping-list-api.service';
import { ItemShoppingList } from '../../../model/item-shopping-list.model';
import { Observable, Subject, mergeMap, takeUntil, tap } from 'rxjs';
import { SimpleLoadingComponent } from "../../../../common/loading/ui/simple-loading/simple-loading.component";
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-edit-item-shopping-list-page',
    standalone: true,
    templateUrl: './edit-item-shopping-list-page.component.html',
    styles: [],
    imports: [
        CommonModule,
        GoBackTopBarComponent,
        EditItemShoppingListFormComponent,
        SimpleLoadingComponent
    ]
})
export class EditItemShoppingListPageComponent implements OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    public loadedItemShoppingList$: Observable<ItemShoppingList>
    = this.loadItemShoppingList();

    public constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly itemShoppingListApiService: ItemShoppingListApiService
    ) { }
    
    public ngOnDestroy(): void {
        this.destroy$.complete();
    }

    public loadItemShoppingList(): Observable<ItemShoppingList> {
        return this.activatedRoute.queryParams
        .pipe(
            mergeMap(params => 
                this.itemShoppingListApiService.loadOneById(params['id'])
            )
        );
    }

    public save(itemShoppingList: ItemShoppingList): void {
        this.itemShoppingListApiService.upate(itemShoppingList)
        .pipe(
            takeUntil(this.destroy$)
        )
        .subscribe();
    }
}
