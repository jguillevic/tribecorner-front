export class Event {
    private _id: number;
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    public constructor() {
        this._id = -1;
    }
}