export class EventDto {
    public constructor(
        public readonly id: number|undefined,      
        public readonly name: string,
        public readonly startingDateTime: string,
        public readonly endingDateTime: string ,
        public readonly allDay: boolean = false
    ) { }
}