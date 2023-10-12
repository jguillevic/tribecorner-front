export class MealKindDto {
    public id: number;
    public name: string;
    public position: number;

    public constructor() {
        this.id = -1;
        this.name = '';
        this.position = -1;
    }
}