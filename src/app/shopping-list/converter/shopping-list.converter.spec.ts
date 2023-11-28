import { LoadShoppingListDto } from '../dto/load-shopping-list.dto';
import { ShoppingListConverter } from './shopping-list.converter';
import { ShoppingList } from '../model/shopping-list.model';

describe('ShoppingListConverter', () => {
  it('should convert fromDtoToModel', () => {
    const loadShoppingListDto: LoadShoppingListDto = {
      id: 1,
      name: 'Groceries',
      isArchived: false,
      items: [
      ],
    };

    const shoppingList = ShoppingListConverter.fromDtoToModel(loadShoppingListDto);

    expect(shoppingList.id).toBe(loadShoppingListDto.id);
    expect(shoppingList.name).toBe(loadShoppingListDto.name);
    expect(shoppingList.isArchived).toBe(loadShoppingListDto.isArchived);
    expect(shoppingList.items).toHaveLength(loadShoppingListDto.items.length);
  });

  it('should convert fromModelToDto', () => {
    const shoppingList = new ShoppingList();
    shoppingList.id = 1;
    shoppingList.name = 'Groceries';
    shoppingList.isArchived = false;

    const editShoppingListDto = ShoppingListConverter.fromModelToDto(shoppingList);

    expect(editShoppingListDto.id).toBe(shoppingList.id);
    expect(editShoppingListDto.name).toBe(shoppingList.name);
    expect(editShoppingListDto.isArchived).toBe(shoppingList.isArchived);
    expect(editShoppingListDto.items).toHaveLength(shoppingList.items.length);
  });
});