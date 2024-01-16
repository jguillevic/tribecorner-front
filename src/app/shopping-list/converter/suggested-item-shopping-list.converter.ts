import {SuggestedItemShoppingListDto} from "../dto/suggested-item-shopping-list.dto";
import {SuggestedItemShoppingList} from "../model/suggested-item-shopping-list";
import {ItemShoppingListCategoryConverter} from "./item-shopping-list-category.converter";

export abstract class SuggestedItemShoppingListConverter {
    public static fromDtoToModel(suggestedItemShoppingListDto: SuggestedItemShoppingListDto): SuggestedItemShoppingList {
        return new SuggestedItemShoppingList(
            suggestedItemShoppingListDto.name,
            ItemShoppingListCategoryConverter.fromDtoToModel(suggestedItemShoppingListDto.category),
            suggestedItemShoppingListDto.count
        );
    }
}