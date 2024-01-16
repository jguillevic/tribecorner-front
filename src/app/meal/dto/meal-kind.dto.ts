export class MealKindDto {
    public constructor(
        public readonly id: number|undefined,
        public readonly name: string,
        public readonly position: number
    ) { }
}