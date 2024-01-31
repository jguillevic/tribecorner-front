import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, TrackByFunction} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslocoModule, TranslocoService, provideTranslocoScope} from '@ngneat/transloco';
import {ItemShoppingList} from '../../../model/item-shopping-list.model';
import {Observable, Subject, debounceTime, filter, of, switchMap, takeUntil, tap} from 'rxjs';
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {ItemShoppingListCategoryApiService} from '../../../service/item-shopping-list-category-api.service';
import {ItemShoppingListCategory} from '../../../model/item-shopping-list-category.model';
import {SuggestedItemShoppingListAutoCompleteService} from '../../../service/suggested-item-shopping-list-auto-complete.service';
import {SuggestedItemShoppingList} from '../../../model/suggested-item-shopping-list';

@Component({
    selector: 'app-edit-item-shopping-list-form',
    standalone: true,
    imports: [
        CommonModule,
        TranslocoModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatAutocompleteModule
    ],
    templateUrl: './edit-item-shopping-list-form.component.html',
    styles: [
    ],
    providers: [
        provideTranslocoScope({
            scope: 'shopping-list/ui/component/edit-item-shopping-list-form',
            alias: 'editItemShoppingListForm'
        })
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditItemShoppingListFormComponent implements OnInit, OnDestroy {
    @Input() public itemShoppingList: ItemShoppingList|undefined;
    @Input() public debounceTime: number = 500;
    @Output() public itemShoppingListEdited: EventEmitter<ItemShoppingList> 
    = new EventEmitter<ItemShoppingList>(); 

    private readonly destroy$ = new Subject<void>();

    public readonly nameCode: string = 'name';
    public readonly categoryCode: string = 'category';

    private readonly maxLengthErrorCode: string = 'maxlength';
    private readonly requiredErrorCode: string = 'required';

    public readonly categories$ 
    = this.itemShoppingListCategoryApiService.categories$;

    public itemShoppingListForm: FormGroup 
    = this.createItemShoppingListForm();

    public readonly suggestedItemShoppingLists$: Observable<SuggestedItemShoppingList[]>
    = this.getNameControl()
    .valueChanges
    .pipe(
        switchMap(itemShoppingListName => 
            this.suggestedItemShoppingListAutoCompleteService
            .getSuggestedItemShoppingListsForAutoComplete(
                itemShoppingListName
            )
        )
    );

    public constructor(
        private readonly formBuilder: FormBuilder,
        private readonly translocoService: TranslocoService,
        private readonly suggestedItemShoppingListAutoCompleteService: SuggestedItemShoppingListAutoCompleteService,
        private readonly itemShoppingListCategoryApiService: ItemShoppingListCategoryApiService
    ) { }

    public ngOnInit(): void {
        this.updateEditItemShoppingListFormFromInput();
        this.emitItemShoppingChanges();
    }

    public ngOnDestroy(): void {
        this.destroy$.complete();
    }

    public createItemShoppingListForm(): FormGroup {
        return this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(255)]],
            category: [0, [Validators.required]]
        });
    }

    private getNameControl(): AbstractControl<any, any> {
        return this.itemShoppingListForm.controls[this.nameCode];
    }

    private getNameControlValue(): string {
        return this.getNameControl().value;
    }

    private updateNameControl(name: string) {
        this.getNameControl().setValue(name);
    }

    private getCategoryControl(): AbstractControl<any, any> {
        return this.itemShoppingListForm.controls[this.categoryCode];
    }

    private getCategoryControlValue(): ItemShoppingListCategory {
        // Renseignement d'une catégorie en partie factice.
        // Seule l'identifiant est intéressant car c'est seulement
        // ce dernier qui sera utilisé par le back.
        const selectedCategory: ItemShoppingListCategory 
        = new ItemShoppingListCategory(
            this.getCategoryControl().value,
            'unused_code',
            'unused_name'
        );

        return selectedCategory;
    }

    public updateCategoryControl(categoryId: number) {
        this.getCategoryControl().setValue(categoryId);
    }

    public updateEditItemShoppingListForm(itemShoppingList: ItemShoppingList) {
        this.updateNameControl(itemShoppingList.name);
        this.updateCategoryControl(itemShoppingList.category.id);
    }

    public updateEditItemShoppingListFormFromInput() {
        if (this.itemShoppingList) {
            this.updateEditItemShoppingListForm(this.itemShoppingList);
        }
    }

    public trackBySuggestedItemShoppingListName: TrackByFunction<SuggestedItemShoppingList> 
    = (index, suggestedItemShoppingList) => suggestedItemShoppingList.name;

    public suggestedItemShoppingListSelected(suggestedItemShoppingList: SuggestedItemShoppingList) {
        this.updateNameControl(suggestedItemShoppingList.name);
        this.updateCategoryControl(suggestedItemShoppingList.category.id);
    }

    public emitItemShoppingChanges() {
        this.itemShoppingListForm.valueChanges
        .pipe(
            debounceTime(this.debounceTime),
            filter(() => 
                !this.itemShoppingListForm.pristine &&
                this.itemShoppingListForm.valid
            ),
            tap(() => {
                if (this.itemShoppingList) {
                     this.itemShoppingListEdited.emit(
                        new ItemShoppingList(
                            this.itemShoppingList.id,
                            this.getNameControlValue(),
                            this.getCategoryControlValue(),
                            this.itemShoppingList.shoppingListId,
                            this.itemShoppingList.isChecked,
                            this.itemShoppingList.position
                        )
                    );
                }
            }),
            takeUntil(this.destroy$)
        )
        .subscribe();
    }

    private buildTradKey(labelKey: string): string {
        return `editItemShoppingListForm.${labelKey}`;
    }

    public getNameErrorMessage(): Observable<string|undefined> {
        const nameControl: AbstractControl<any, any> = this.getNameControl();

        if (nameControl.hasError(this.requiredErrorCode)) {
            return this.translocoService.selectTranslate(this.buildTradKey('nameRequired'));
        } else if (nameControl.hasError(this.maxLengthErrorCode)) {
            const maxLength = nameControl.getError(this.maxLengthErrorCode)['requiredLength'];
            return this.translocoService.selectTranslate(this.buildTradKey('nameTooLong'), {maxLength: maxLength})
        }

        return of(undefined);
    }

    public getCategoryErrorMessage(): Observable<string|undefined> {
        const categoryControl: AbstractControl<any, any> = this.getCategoryControl();

        if (categoryControl.hasError(this.requiredErrorCode)) {
            return this.translocoService.selectTranslate(this.buildTradKey('categoryRequired'));
        }

        return of(undefined);
    }
}
