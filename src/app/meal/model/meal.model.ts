import { DateHelper } from "../../common/date/helper/date.helper";

export class Meal {
    public id: number;
    public familyId: number;
    public name: string;
    public date: Date;
    public numberOfPersons: number;
    public mealKindId: number;
    
    public constructor() {
        this.id = 0;
        this.familyId = 0;
        this.name = '';
        this.date = DateHelper.getCurrentDate();
        this.numberOfPersons = 1;
        this.mealKindId = -1;
    }
}