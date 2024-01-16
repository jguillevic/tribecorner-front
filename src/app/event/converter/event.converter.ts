import {EventDto} from "../dto/event.dto";
import {Event} from "../model/event.model";

export abstract class EventConverter {
    public static fromDtoToModel(eventDto: EventDto): Event {
        return new Event(
            eventDto.id ?? 0,
            eventDto.name,
            new Date(eventDto.startingDateTime),
            new Date(eventDto.endingDateTime),
            eventDto.allDay
        );
    }

    public static fromModelToDto(event: Event): EventDto {
        return new EventDto(
            undefined,
            event.name,
            event.startingDateTime.toISOString(),
            event.endingDateTime.toISOString(),
            event.allDay
        );
    }
}