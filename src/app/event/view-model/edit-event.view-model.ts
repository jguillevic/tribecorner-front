export class EditEventViewModel {
    public constructor(
        public id: number,  
        public readonly name: string,
        public readonly startingDate: Date,
        public readonly startingTime: number,
        public readonly endingDate: Date,
        public readonly endingTime: number,
        public readonly allDay: boolean
    ) {
        this.id = id;
        this.name = name;
        this.startingDate = startingDate;
        this.startingTime = startingTime;
        this.endingDate = endingDate;
        this.endingTime = endingTime;
        this.allDay = allDay;
    }
}