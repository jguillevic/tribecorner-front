export class MealKind {
    private _id: number;
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    private _name: string;
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    private _position: number;
    public get position(): number {
        return this._position;
    }
    public set position(value: number) {
        this._position = value;
    }

    public constructor() {
        this._id = -1;
        this._name = '';
        this._position = -1;
    }
}