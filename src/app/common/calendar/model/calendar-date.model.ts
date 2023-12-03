import { DateHelper } from "../../date/helper/date.helper";

export class CalendarDate {
    public date: Date;
    public isSelected: boolean;

    public constructor() {
        this.date = DateHelper.getInvariantCurrentDate();
        this.isSelected = false;
    }
}