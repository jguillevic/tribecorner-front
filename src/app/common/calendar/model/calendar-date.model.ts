import { DateHelper } from "../../date/helper/date.helper";

export class CalendarDate {
    public date: Date;
    public isSelected: boolean;

    public constructor() {
        this.date = DateHelper.getInvarianteCurrentDateWithoutTimeZone();
        this.isSelected = false;
    }
}