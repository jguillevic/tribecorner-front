export class LoadEventDto {
    public constructor(
        public readonly id: number,      
        public readonly name: string,
        public readonly startingDateTime: string,
        public readonly endingDateTime: string ,
        public readonly allDay: boolean = false
    ) { }
}