import { EventConverter } from './event.converter';
import { LoadEventDto } from '../dto/load-event.dto';
import { EditEventDto } from '../dto/edit-event.dto';
import { Event } from '../model/event.model';

describe('EventConverter', () => {
  describe('fromDtoToModel', () => {
    it('should convert LoadEventDto to Event', () => {
      // Arrange
      const loadEventDto: LoadEventDto = {
        id: 1,
        name: 'Test Event',
        startingDateTime: new Date('2023-01-01T10:00:00'),
        endingDateTime: new Date('2023-01-01T12:00:00'),
        allDay: false,
      };

      // Act
      const result: Event = EventConverter.fromDtoToModel(loadEventDto);

      // Assert
      expect(result.id).toBe(loadEventDto.id);
      expect(result.name).toBe(loadEventDto.name);
      expect(result.startingDateTime).toEqual(loadEventDto.startingDateTime);
      expect(result.endingDateTime).toEqual(loadEventDto.endingDateTime);
      expect(result.allDay).toBe(loadEventDto.allDay);
    });
  });

  describe('fromModelToDto', () => {
    it('should convert Event to EditEventDto', () => {
      // Arrange
      const event: Event = new Event(
        1,
        'Test Event',
        new Date('2023-01-01T10:00:00'),
        new Date('2023-01-01T12:00:00'),
        false
      );

      // Act
      const result: EditEventDto = EventConverter.fromModelToDto(event);

      // Assert
      expect(result.name).toBe(event.name);
      expect(result.startingDateTime).toEqual(event.startingDateTime);
      expect(result.endingDateTime).toEqual(event.endingDateTime);
      expect(result.allDay).toBe(event.allDay);
    });
  });
});
