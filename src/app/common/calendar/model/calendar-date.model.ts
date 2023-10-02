export class CalendarDate {
    public date: Date;
    public isSelected: boolean;

    public constructor() {
        this.date = new Date();
        this.isSelected = false;
    }
}