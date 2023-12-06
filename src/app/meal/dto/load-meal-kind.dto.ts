export class LoadMealKindDto {
    public constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly position: number
    ) { }
}