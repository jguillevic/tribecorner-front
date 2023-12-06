export class Event {
    public constructor(
        public id: number,      
        public readonly name: string,
        public readonly startingDateTime: Date,
        public readonly endingDateTime: Date,
        public readonly allDay: boolean
    ) {
        this.id = id;
        this.name = name;
        this.startingDateTime = startingDateTime;
        this.endingDateTime = endingDateTime;
        this.allDay = allDay;
    }
}