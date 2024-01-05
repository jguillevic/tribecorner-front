import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemShoppingList } from '../../../model/item-shopping-list.model';

@Component({
selector: 'app-add-item-shopping-list-form',
standalone: true,
imports: [
    CommonModule,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators
],
templateUrl: './add-item-shopping-list-form.component.html',
styleUrls: [
    './add-item-shopping-list-form.component.scss'
]
})
export class AddItemShoppingListFormComponent {
    @Input() public readonly currentItemShoppingLists: ItemShoppingList[] = [];
    @Output() public readonly itemShoppingListAdded: EventEmitter<ItemShoppingList> = new EventEmitter<ItemShoppingList>();

    public readonly addItemShoppingListForm: FormGroup = new FormGroup(
      {
        itemShoppingListName: new FormControl('', [Validators.maxLength(255)])
      }
    );

    public getItemShoppingListNameControl(): AbstractControl<any, any> {
        return this.addItemShoppingListForm.controls['itemShoppingListName'];
    }

    public getItemShoppingListNameErrorMessage(): string|undefined {
        return '';
    }

    public submitItemShoppingList(): void {
        if (this.addItemShoppingListForm.valid)
        {
            const itemShoppingListName: string = this.getItemShoppingListNameControl().value;
        
            if (itemShoppingListName.length) {
                if (this.currentItemShoppingLists.find(item => item.name === itemShoppingListName)) {
                this.getItemShoppingListNameControl().setErrors({'already-added': true});
                return;
                }
        
                const itemShoppingList: ItemShoppingList  = new ItemShoppingList();
                itemShoppingList.name = itemShoppingListName;
                this.currentItemShoppingLists.push(itemShoppingList);
                itemShoppingList.position = this.currentItemShoppingLists.indexOf(itemShoppingList) + 1;
                this.getItemShoppingListNameControl().setValue('');
                this.itemShoppingListAdded.emit(itemShoppingList);
            }
        }
    }
}
