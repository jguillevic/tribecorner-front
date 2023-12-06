export class EditEventViewModel {
    public constructor(
        public id: number,  
        public readonly name: string,
        public readonly startingDate: Date,
        public readonly startingTime: number,
        public readonly endingDate: Date,
        public readonly endingTime: number,
        public readonly allDay: boolean
    ) { }
}