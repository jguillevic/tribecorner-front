import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService, provideTranslocoScope } from '@ngneat/transloco';
import { ItemShoppingList } from '../../../model/item-shopping-list.model';
import { Observable, Subject, debounceTime, filter, of, takeUntil, tap } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-edit-item-shopping-list-form',
    standalone: true,
    imports: [
        CommonModule,
        TranslocoModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule
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

    private readonly maxLengthErrorCode: string = 'maxlength';
    private readonly requiredErrorCode: string = 'required';

    public itemShoppingListForm: FormGroup 
    = this.createItemShoppingListForm();

    public constructor(
        private readonly formBuilder: FormBuilder,
        private readonly translocoService: TranslocoService
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
            name: ['', [Validators.required, Validators.maxLength(255)]]
        });
    }

    public getNameControl(): AbstractControl<any, any> {
        return this.itemShoppingListForm.controls[this.nameCode];
    }

    public getNameControlValue(): string {
        return this.getNameControl().value;
    }

    public updateNameControl(name: string) {
        this.getNameControl().setValue(name);
    }

    public updateEditItemShoppingListForm(itemShoppingList: ItemShoppingList) {
        this.updateNameControl(itemShoppingList.name);
    }

    public updateEditItemShoppingListFormFromInput() {
        if (this.itemShoppingList) {
            this.updateEditItemShoppingListForm(this.itemShoppingList);
        }
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
                            this.itemShoppingList.category,
                            this.itemShoppingList.shoppingListId,
                            this.itemShoppingList.isChecked,
                            this.itemShoppingList.position
                        )
                    )
                }
            }),
            takeUntil(this.destroy$)
        )
        .subscribe();
    }

    public buildTradKey(labelKey: string): string {
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
}
