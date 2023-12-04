import { EditEventDto } from "../dto/edit-event.dto";
import { LoadEventDto } from "../dto/load-event.dto";
import { Event } from "../model/event.model";

export abstract class EventConverter {
    public static fromDtoToModel(loadEventDto: LoadEventDto): Event {
        return new Event(
            loadEventDto.id,
            loadEventDto.name,
            new Date(loadEventDto.startingDateTime),
            new Date(loadEventDto.endingDateTime),
            loadEventDto.allDay
        );
    }

    public static fromModelToDto(event: Event): EditEventDto {
        return new EditEventDto(
            event.name,
            event.startingDateTime.toUTCString(),
            event.endingDateTime.toUTCString(),
            event.allDay
        );
    }
}