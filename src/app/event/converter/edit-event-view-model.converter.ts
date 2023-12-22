import { EditEventViewModel } from "../ui/view-model/edit-event.view-model";
import { Event } from "../model/event.model";
import { DateHelper } from "../../common/date/helper/date.helper";

export abstract class EditEventViewModelConverter {
    public static fromModelToViewModel(event: Event): EditEventViewModel {
        const editEventViewModel = new EditEventViewModel(
            event.id,
            event.name,
            DateHelper.getDate(event.startingDateTime),
            event.startingDateTime.getHours() * 60 + event.startingDateTime.getMinutes(),
            DateHelper.getDate(event.endingDateTime),
            event.endingDateTime.getHours() * 60 + event.endingDateTime.getMinutes(),
            event.allDay
        );

        return editEventViewModel;
    }

    public static fromViewModelToModel(editEventViewModel: EditEventViewModel) {
        const startingDateTime: Date 
        = EditEventViewModelConverter.convertToDateTime(
            editEventViewModel.startingDate,
            editEventViewModel.startingTime
        );
        const endingDateTime: Date 
        = EditEventViewModelConverter.convertToDateTime(
            editEventViewModel.endingDate,
            editEventViewModel.endingTime
        );

        const event: Event = new Event(
            editEventViewModel.id,
            editEventViewModel.name,
            startingDateTime,
            endingDateTime,
            editEventViewModel.allDay
        );

        return event;
    }

    public static convertToDateTime(date: Date, time: number): Date {
        const hours: number = Math.floor(time / 60);
        const minutes: number = time % 60;
        
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            hours,
            minutes,
            0
        );
    }
}