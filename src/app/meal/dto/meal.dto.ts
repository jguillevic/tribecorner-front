import { DateHelperService } from "src/app/common/date/service/date-helper.service";

export class MealDto {
    public id: number|undefined;
    public familyId: number;
    public name: string;
    public date: Date;
    public numberOfPersons: number;
    public mealKindId: number;

    public constructor(
        private dateHelperService:DateHelperService
    ) {
        this.familyId = -1;
        this.name = '';
        this.date = this.dateHelperService.getInvarianteCurrentDateWithoutTimeZone();
        this.numberOfPersons = 1;
        this.mealKindId = -1;
    }
}