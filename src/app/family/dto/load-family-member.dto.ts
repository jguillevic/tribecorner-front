export class LoadFamilyMemberDto {
    public constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly userId: number,
        public readonly username: string
    ) { }
}