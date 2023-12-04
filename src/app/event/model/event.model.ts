import { DateHelper } from "../../common/date/helper/date.helper";

export class Event {
    public id: number;
    public name: string;
    public startingDateTime: Date;
    public endingDateTime: Date;
    public allDay: boolean;

    public constructor(
        id: number,      
        name: string,
        startingDateTime: Date,
        endingDateTime: Date,
        allDay: boolean
    ) {
        this.id = id;
        this.name = name;
        this.startingDateTime = startingDateTime;
        this.endingDateTime = endingDateTime;
        this.allDay = allDay;
    }
}