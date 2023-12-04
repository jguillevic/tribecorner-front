import { DateHelper } from "../../common/date/helper/date.helper";

export class LoadEventDto {
    public id: number;
    public name: string;
    public startingDateTime: string;
    public endingDateTime: string;
    public allDay: boolean;

    public constructor(
        id: number,      
        name: string,
        startingDateTime: string,
        endingDateTime: string ,
        allDay: boolean = false
    ) {
        this.id = id;
        this.name = name;
        this.startingDateTime = startingDateTime;
        this.endingDateTime = endingDateTime;
        this.allDay = allDay;
    }
}