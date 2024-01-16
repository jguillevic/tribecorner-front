import { EventConverter } from './event.converter';
import { LoadEventDto } from '../dto/event.dto';
import { EditEventDto } from '../dto/edit-event.dto';
import { Event } from '../model/event.model';

describe('EventConverter', () => {
  describe('fromDtoToModel', () => {
    it('should convert LoadEventDto to Event', () => {
      // Arrange
      const loadEventDto: LoadEventDto = {
        id: 1,
        name: 'Test Event',
        startingDateTime: '2023-01-01T10:00:00.000Z',
        endingDateTime: '2023-01-01T12:00:00.000Z',
        allDay: false,
      };

      // Act
      const result: Event = EventConverter.fromDtoToModel(loadEventDto);

      // Assert
      expect(result.id).toBe(loadEventDto.id);
      expect(result.name).toBe(loadEventDto.name);
      expect(result.startingDateTime).toEqual(new Date(loadEventDto.startingDateTime));
      expect(result.endingDateTime).toEqual(new Date(loadEventDto.endingDateTime));
      expect(result.allDay).toBe(loadEventDto.allDay);
    });
  });

  describe('fromModelToDto', () => {
    it('should convert Event to EditEventDto', () => {
      // Arrange
      const event: Event = new Event(
        1,
        'Test Event',
        new Date('2023-01-01T10:00:00Z'),
        new Date('2023-01-01T12:00:00Z'),
        false
      );

      // Act
      const result: EditEventDto = EventConverter.fromModelToDto(event);

      // Assert
      expect(result.name).toBe(event.name);
      expect(result.startingDateTime).toEqual(event.startingDateTime.toISOString());
      expect(result.endingDateTime).toEqual(event.endingDateTime.toISOString());
      expect(result.allDay).toBe(event.allDay);
    });
  });
});
