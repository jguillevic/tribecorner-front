export class Event {
    public constructor(
        public id: number,      
        public readonly name: string,
        public readonly startingDateTime: Date,
        public readonly endingDateTime: Date,
        public readonly allDay: boolean
    ) { }
}