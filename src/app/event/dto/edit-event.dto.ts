import { DateHelper } from "../../common/date/helper/date.helper";

export class EditEventDto {
    public name: string;
    public startingDateTime: Date;
    public endingDateTime: Date;
    public allDay: boolean;

    public constructor(
        name: string = '',
        startingDateTime: Date = DateHelper.getInvariantCurrentDateTime(),
        endingDateTime: Date = DateHelper.getInvariantCurrentDateTime(),
        allDay: boolean = false
    ) {
        this.name = name;
        this.startingDateTime = startingDateTime;
        this.endingDateTime = endingDateTime;
        this.allDay = allDay;
    }
}