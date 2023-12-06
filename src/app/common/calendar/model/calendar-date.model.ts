export class CalendarDate {
    public constructor(
        public date: Date,
        public isSelected: boolean
    ) {
        this.date = date;
        this.isSelected = isSelected;
    }
}