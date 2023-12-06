export class EditEventDto {
    public constructor(
        public readonly name: string,
        public readonly startingDateTime: string,
        public readonly endingDateTime: string,
        public readonly allDay: boolean
    ) { }
}