import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ItemShoppingList} from '../../../model/item-shopping-list.model';
import {Observable, Subject} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {ItemShoppingListGoToService} from '../../../service/item-shopping-list-go-to.service';
import {ItemShoppingListsByCategoryViewModel} from '../../view-model/item-shopping-lists-by-category.view-model';

@Component({
  selector: 'app-checkable-item-shopping-lists',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule
],
  templateUrl: './checkable-item-shopping-lists.component.html',
  styleUrls: [
    './checkable-item-shopping-lists.component.scss'
  ]
})
export class CheckableItemShoppingListsComponent implements OnChanges, OnDestroy {
    @Input() public itemShoppingLists: ItemShoppingList[] = [];
    @Output() public itemShoppingListDeleted: EventEmitter<ItemShoppingList> = new EventEmitter<ItemShoppingList>();
    @Output() public itemShoppingListToggled: EventEmitter<ItemShoppingList> = new EventEmitter<ItemShoppingList>();

    private readonly destroy$ = new Subject<void>();

    public itemShoppingListsByCategories: ItemShoppingListsByCategoryViewModel[] = [];

    public constructor(
        private readonly itemShoppingListGoToService: ItemShoppingListGoToService
    ) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['itemShoppingLists']) {
            this.itemShoppingListsByCategories 
            = this.getItemShoppingListByCategories(changes['itemShoppingLists'].currentValue);
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.complete();
    }
    
    private getItemShoppingListByCategories(itemShoppingLists: ItemShoppingList[]): ItemShoppingListsByCategoryViewModel[] {
        const itemShoppingListByCategories: ItemShoppingListsByCategoryViewModel[] = [];
        itemShoppingLists.forEach((itemShoppingList: ItemShoppingList) => {
            const itemShoppingListByCategory: ItemShoppingListsByCategoryViewModel|undefined
             = itemShoppingListByCategories
             .find((itemShoppingListByCategory: ItemShoppingListsByCategoryViewModel) => 
            itemShoppingListByCategory.category.id === itemShoppingList.category.id);

            if(itemShoppingListByCategory) {
                itemShoppingListByCategory.itemShoppingLists.push(itemShoppingList);
            } else {
                // Recherche de la catégorie dans le tableau actuel.
                const previousItemShoppingListsByCategory: ItemShoppingListsByCategoryViewModel|undefined
                = this.itemShoppingListsByCategories
                .find(
                    (prevItemShoppingListByCategory: ItemShoppingListsByCategoryViewModel) => 
                    prevItemShoppingListByCategory.category.id === itemShoppingList.category.id
                );

                itemShoppingListByCategories
                .push(
                    new ItemShoppingListsByCategoryViewModel(
                        itemShoppingList.category,
                        [itemShoppingList],
                        // La valeur de isExpanded est prise sur l'ancien objet si trouvé.
                        // Sinon, undefined ce qui va entraîner le calcul à la création de l'objet.
                        previousItemShoppingListsByCategory?.isExpanded ?? undefined
                    )
                );
            }
        });
        
        itemShoppingListByCategories.forEach((itemShoppingListByCategory: ItemShoppingListsByCategoryViewModel) => {
            itemShoppingListByCategory.itemShoppingLists.sort((a, b) => {
              if (a.isChecked !== b.isChecked) {
                // Tri par statut isChecked (les non cochés d'abord).
                return a.isChecked ? 1 : -1;
              } else {
                // Si les statuts isChecked sont égaux, tri par position.
                return a.position - b.position;
              }
            });
        });
        
        return itemShoppingListByCategories;
    }

    public trackByItemShoppingListsByCategory(index: number, itemShoppingListsByCategory: ItemShoppingListsByCategoryViewModel): number {
        return itemShoppingListsByCategory.category.id??0;
    }

    public trackByItemShoppingList(index: number, itemShoppingList: ItemShoppingList): string {
        return `${itemShoppingList.name}${itemShoppingList.id??0}`;
    }

    public goToItemShoppingListUpdate(itemShoppingListId: number|undefined): Observable<boolean> {
        return this.itemShoppingListGoToService.goToUpdate(itemShoppingListId);
      }

    public deleteItemShoppingList(itemShoppingList: ItemShoppingList): void {
        this.itemShoppingListDeleted.emit(itemShoppingList);
    }

    public toggleItemShoppingList(itemShoppingList: ItemShoppingList, itemShoppingListsByCategory: ItemShoppingListsByCategoryViewModel): void {
        itemShoppingList.isChecked = !itemShoppingList.isChecked;
        itemShoppingListsByCategory.calcIsExpanded();

        this.itemShoppingListToggled.emit(itemShoppingList);
    }
}
