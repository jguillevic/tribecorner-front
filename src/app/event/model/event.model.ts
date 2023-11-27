import { DateHelper } from "../../common/date/helper/date.helper";

export class Event {
    public id: number;
    public name: string;
    public startingDateTime: Date;
    public endingDateTime: Date;
    public allDay: boolean;

    public constructor(
        id: number = 0,      
        name: string = '',
        startingDateTime: Date = DateHelper.getInvariantCurrentDateTime(),
        endingDateTime: Date = DateHelper.getInvariantCurrentDateTime(),
        allDay: boolean = false
    ) {
        this.id = id;
        this.name = name;
        this.startingDateTime = startingDateTime;
        this.endingDateTime = endingDateTime;
        this.allDay = allDay;
    }
}