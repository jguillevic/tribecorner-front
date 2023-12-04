export class LoadMealKindDto {
    public readonly id: number;
    public readonly name: string;
    public readonly position: number;

    public constructor(
        id: number,
        name: string,
        position: number
    ) {
        this.id = id;
        this.name = name;
        this.position = position;
    }
}