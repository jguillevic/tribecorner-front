import { DateHelper } from "../../common/date/helper/date.helper";

export class EditEventDto {
    public name: string;
    public startingDateTime: string;
    public endingDateTime: string;
    public allDay: boolean;

    public constructor(
        name: string,
        startingDateTime: string,
        endingDateTime: string,
        allDay: boolean
    ) {
        this.name = name;
        this.startingDateTime = startingDateTime;
        this.endingDateTime = endingDateTime;
        this.allDay = allDay;
    }
}