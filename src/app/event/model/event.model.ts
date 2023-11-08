export class Event {
    public id: number;
    public name: string;
    public startingDateTime: Date;
    public endingDateTime: Date;
    public allDay: boolean;

    public constructor() {
        this.id = -1;
        this.name = '';
        this.startingDateTime = new Date();
        this.endingDateTime = new Date();
        this.allDay = false;
    }
}