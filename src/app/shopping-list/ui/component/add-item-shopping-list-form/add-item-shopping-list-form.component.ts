import { Component, EventEmitter, Input, OnDestroy, Output, TrackByFunction } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemShoppingList } from '../../../model/item-shopping-list.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SuggestedItemShoppingList } from '../../../model/suggested-item-shopping-list';
import { Observable, Subject, of, switchMap, takeUntil, tap } from 'rxjs';
import { TranslocoModule, TranslocoService, provideTranslocoScope } from '@ngneat/transloco';
import { SuggestedItemShoppingListAutoCompleteService } from '../../../service/suggested-item-shopping-list-auto-complete.service';
import { ItemShoppingListCategoryApiService } from '../../../service/item-shopping-list-category-api.service';

@Component({
selector: 'app-add-item-shopping-list-form',
standalone: true,
imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatInputModule,
    TranslocoModule
],
providers: [
    provideTranslocoScope({scope: 'shopping-list/ui/component/add-item-shopping-list-form', alias: 'addItemShoppingListForm'})
],
templateUrl: './add-item-shopping-list-form.component.html',
styleUrls: [
    './add-item-shopping-list-form.component.scss'
]
})
export class AddItemShoppingListFormComponent implements OnDestroy {
    @Input() public currentShoppingListId: number|undefined;
    @Input() public currentItemShoppingLists: ItemShoppingList[] | null = [];
    @Output() public itemShoppingListAdded: EventEmitter<ItemShoppingList> = new EventEmitter<ItemShoppingList>();

    private readonly destroy$: Subject<void> = new Subject<void>();

    public readonly itemShoppingListNameCode: string = 'itemShoppingListName';
    private readonly maxLengthErrorCode: string = 'maxlength';
    private readonly alreadyAddedErrorCode: string = 'already-added';

    public readonly addItemShoppingListForm: FormGroup = new FormGroup({
        itemShoppingListName: new FormControl('', [Validators.maxLength(255)])
    });

    public readonly suggestedItemShoppingLists$: Observable<SuggestedItemShoppingList[]>
    = this.getItemShoppingListNameControl().valueChanges
    .pipe(
        switchMap(itemShoppingListName => 
            this.suggestedItemShoppingListAutoCompleteService
            .getSuggestedItemShoppingListsForAutoComplete(
                itemShoppingListName,
                this.currentItemShoppingLists ?? []
            )
        )
    );

    public constructor(
        private readonly suggestedItemShoppingListAutoCompleteService: SuggestedItemShoppingListAutoCompleteService,
        private readonly itemShoppingListCategoryApiService: ItemShoppingListCategoryApiService,
        private readonly translocoService: TranslocoService
    ) { }

    public ngOnDestroy(): void {
        this.destroy$.complete();
    }
    
    public trackBySuggestedItemShoppingListName: TrackByFunction<SuggestedItemShoppingList> 
    = (index, suggestedItemShoppingList) => suggestedItemShoppingList.name;
    
    public suggestedItemShoppingListSelected(suggestedItemShoppingList: SuggestedItemShoppingList) {
        if (this.currentShoppingListId) {
            const itemShoppingList: ItemShoppingList  = new ItemShoppingList(
                undefined,
                suggestedItemShoppingList.name,
                suggestedItemShoppingList.category,
                this.currentShoppingListId,
                false,
                undefined
            );

            this.emitItemShoppingList(itemShoppingList);
        }
    }

    private getItemShoppingListNameControl(): AbstractControl<any, any> {
        return this.addItemShoppingListForm.controls[this.itemShoppingListNameCode];
    }

    private getItemShoppingListNameValue(): string {
        return this.getItemShoppingListNameControl().value;
    }

    private updateItemShoppingListNameControl(itemShoppingListName: string): void {
        this.getItemShoppingListNameControl().setValue(itemShoppingListName);
    }

    public isAddButtonEnabled(): boolean {
        return this.getItemShoppingListNameValue().length > 0;
    }

    public getItemShoppingListNameErrorMessage(): Observable<string|undefined> {
        const itemShoppingListNameControl: AbstractControl<any, any> = this.getItemShoppingListNameControl();

        if (itemShoppingListNameControl.hasError(this.maxLengthErrorCode)) {
            const maxLength = itemShoppingListNameControl.getError(this.maxLengthErrorCode)['requiredLength'];
            return this.translocoService.selectTranslate('addItemShoppingListForm.nameTooLong', {maxLength: maxLength})
        } else if (itemShoppingListNameControl.hasError(this.alreadyAddedErrorCode)) {
            return this.translocoService.selectTranslate('addItemShoppingListForm.alreadyAdded')
        }

        return of(undefined);
    }

    public submitItemShoppingList(): void {
        if (this.addItemShoppingListForm.valid)
        {
            const itemShoppingListName: string = this.getItemShoppingListNameControl().value;
        
            if (itemShoppingListName.length) {
                this.itemShoppingListCategoryApiService.defaultCategory$
                .pipe(
                    tap(defaultCategory => {
                        if (this.currentShoppingListId &&
                            defaultCategory) {
                            const itemShoppingList: ItemShoppingList  
                            = new ItemShoppingList(
                                undefined,
                                itemShoppingListName,
                                defaultCategory,
                                this.currentShoppingListId,
                                false,
                                undefined
                            );
                            
                            this.emitItemShoppingList(itemShoppingList);
                        }
                    }),
                    takeUntil(this.destroy$)
                )
                .subscribe();
            }
        }
    }

    private emitItemShoppingList(itemShoppingList: ItemShoppingList): void {
        const itemShoppingListName: string = itemShoppingList.name;

        if (this.currentItemShoppingLists?.find(item => item.name.toLowerCase() === itemShoppingListName.toLowerCase())) {
            this.getItemShoppingListNameControl().setErrors({[this.alreadyAddedErrorCode]: true});
            return;
        }

        this.updateItemShoppingListNameControl('');
        this.itemShoppingListAdded.emit(itemShoppingList);
    }
}
