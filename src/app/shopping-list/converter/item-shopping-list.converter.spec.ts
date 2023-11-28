import { ItemShoppingListConverter } from './item-shopping-list.converter';
import { LoadItemShoppingListDto } from '../dto/load-item-shopping-list.dto';
import { EditItemShoppingListDto } from '../dto/edit-item-shopping-list.dto';
import { ItemShoppingList } from '../model/item-shopping-list.model';

describe('ItemShoppingListConverter', () => {
  describe('fromDtoToModel', () => {
    it('should convert LoadItemShoppingListDto to ItemShoppingList', () => {
      const loadDto: LoadItemShoppingListDto = {
        id: 1,
        name: 'Item Name',
        isChecked: true,
        position: 2,
      };

      const result: ItemShoppingList = ItemShoppingListConverter.fromDtoToModel(loadDto);

      expect(result.id).toBe(loadDto.id);
      expect(result.name).toBe(loadDto.name);
      expect(result.isChecked).toBe(loadDto.isChecked);
      expect(result.position).toBe(loadDto.position);
    });
  });

  describe('fromModelToDto', () => {
    it('should convert ItemShoppingList to EditItemShoppingListDto', () => {
      const item: ItemShoppingList = {
        id: 1,
        name: 'Item Name',
        isChecked: true,
        position: 2,
      };

      const result: EditItemShoppingListDto = ItemShoppingListConverter.fromModelToDto(item);

      expect(result.id).toBe(item.id);
      expect(result.name).toBe(item.name);
      expect(result.isChecked).toBe(item.isChecked);
      expect(result.position).toBe(item.position);
    });
  });
});