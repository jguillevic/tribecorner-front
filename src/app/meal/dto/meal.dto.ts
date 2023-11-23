import { DateHelper } from "../../common/date/helper/date.helper";

export class MealDto {
    public id: number|undefined;
    public familyId: number;
    public name: string;
    public date: Date;
    public numberOfPersons: number;
    public mealKindId: number;

    public constructor() {
        this.familyId = -1;
        this.name = '';
        this.date = DateHelper.getInvariantCurrentDateWithoutTime();
        this.numberOfPersons = 1;
        this.mealKindId = -1;
    }
}