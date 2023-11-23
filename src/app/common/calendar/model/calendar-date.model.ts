import { DateHelperService } from "../../date/service/date-helper.service";

export class CalendarDate {
    public date: Date;
    public isSelected: boolean;

    public constructor(private dateHelperService: DateHelperService) {
        this.date = dateHelperService.getInvarianteCurrentDateWithoutTimeZone();
        this.isSelected = false;
    }
}