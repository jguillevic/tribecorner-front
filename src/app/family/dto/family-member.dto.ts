export class FamilyMemberDto {
    public constructor(
        public readonly id: number|undefined,
        public readonly familyId: number|undefined,
        public readonly userId: number,
        public readonly username: string|undefined
    ) { }
}