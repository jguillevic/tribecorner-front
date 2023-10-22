export class Meal {
    private _id: number;
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    private _familyId: number;
    public get familyId(): number {
        return this._familyId;
    }
    public set familyId(value: number) {
        this._familyId = value;
    }

    private _name: string;
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    
    private _date: Date;
    public get date(): Date {
        return this._date;
    }
    public set date(value: Date) {
        this._date = value;
    }

    private _numberOfPersons: number;
    public get numberOfPersons(): number {
        return this._numberOfPersons;
    }
    public set numberOfPersons(value: number) {
        this._numberOfPersons = value;
    }

    private _mealKindId: number;
    public get mealKindId(): number {
        return this._mealKindId;
    }
    public set mealKindId(value: number) {
        this._mealKindId = value;
    }
    
    public constructor() {
        this._id = -1;
        this._familyId = -1;
        this._name = '';
        this._date = new Date();
        this._numberOfPersons = 1;
        this._mealKindId = -1;
    }
}