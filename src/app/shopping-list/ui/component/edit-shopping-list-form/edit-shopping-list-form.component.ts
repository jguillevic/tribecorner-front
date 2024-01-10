import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormBuilder, AbstractControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Observable, Subject, debounceTime, filter, of, takeUntil, tap} from 'rxjs';
import {ShoppingList} from '../../../model/shopping-list.model';
import {TranslocoModule, TranslocoService, provideTranslocoScope} from '@ngneat/transloco';

@Component({
    selector: 'app-edit-shopping-list-form',
    standalone: true,
    imports: [
        CommonModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        TranslocoModule
    ],
    templateUrl: './edit-shopping-list-form.component.html',
    styles: [
    ],
    providers: [
        provideTranslocoScope({
            scope: 'shopping-list/ui/component/edit-shopping-list-form',
            alias: 'editShoppingListForm'
        })
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditShoppingListFormComponent implements OnInit, OnDestroy {
    @Input() public shoppingList: ShoppingList|undefined;
    @Input() public debounceTime: number = 500;
    @Output() public shoppingListEdited: EventEmitter<ShoppingList> 
    = new EventEmitter<ShoppingList>(); 

    private destroy$: Subject<void> = new Subject<void>();

    public readonly nameCode: string = 'name';

    private readonly maxLengthErrorCode: string = 'maxlength';
    private readonly requiredErrorCode: string = 'required';

    public readonly editShoppingListForm: FormGroup 
    = this.createEditShoppingListForm();

    public constructor(
        private readonly formBuilder: FormBuilder,
        private readonly translocoService: TranslocoService
    ) { }

    public ngOnInit(): void {
        this.updateEditShoppingListFormFromInput();
        this.emitShoppingChanges();
    }

    public ngOnDestroy(): void {
        this.destroy$.complete();
    }

    private createEditShoppingListForm(): FormGroup {
        return this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(255)]]
        });
    }

    private getNameControl(): AbstractControl<any, any> {
        return this.editShoppingListForm.controls['shoppingListName'];
      }
    
    private getNameControlValue(): string {
        return this.getNameControl().value;
    }

    private updateNameControl(name: string): void {
        this.getNameControl().setValue(name);
    }

    private updateEditShoppingListForm(shoppingList: ShoppingList): void {
        this.updateNameControl(shoppingList.name);
    }

    public getNameErrorMessage(): Observable<string> {
        return of('');
    }

    public updateEditShoppingListFormFromInput() {
        if (this.shoppingList) {
            this.updateEditShoppingListForm(this.shoppingList);
        }
    }

    private getShoppingList(): ShoppingList {
        const shoppingList: ShoppingList = new ShoppingList();
    
        if (this.shoppingList) {
            shoppingList.id = this.shoppingList.id;
            shoppingList.isArchived = this.shoppingList.isArchived;
            shoppingList.name = this.getNameControlValue();
        }
    
        return shoppingList;
    }

    public emitShoppingChanges() {
        this.editShoppingListForm.valueChanges
        .pipe(
            debounceTime(this.debounceTime),
            filter(() => 
                !this.editShoppingListForm.pristine &&
                this.editShoppingListForm.valid
            ),
            tap(() => {
                if (this.shoppingList) {
                    this.shoppingListEdited.emit(
                        this.getShoppingList()
                    )
                }
            }),
            takeUntil(this.destroy$)
        )
        .subscribe();
    }
}
