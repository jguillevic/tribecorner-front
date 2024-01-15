import {LoadSuggestedItemShoppingListDto} from "../dto/load-suggested-item-shopping-list.dto";
import {SuggestedItemShoppingList} from "../model/suggested-item-shopping-list";
import {ItemShoppingListCategoryConverter} from "./item-shopping-list-category.converter";

export abstract class SuggestedItemShoppingListConverter {
    public static fromDtoToModel(loadSuggestedItemShoppingListDto: LoadSuggestedItemShoppingListDto): SuggestedItemShoppingList {
        return new SuggestedItemShoppingList(
            loadSuggestedItemShoppingListDto.name,
            ItemShoppingListCategoryConverter.fromDtoToModel(loadSuggestedItemShoppingListDto.category),
            loadSuggestedItemShoppingListDto.count
        );
    }
}