export class EditEventDto {
    public constructor(
        public readonly name: string,
        public readonly startingDateTime: string,
        public readonly endingDateTime: string,
        public readonly allDay: boolean
    ) {
        this.name = name;
        this.startingDateTime = startingDateTime;
        this.endingDateTime = endingDateTime;
        this.allDay = allDay;
    }
}