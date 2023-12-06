export class CreateFamilyMemberDto {
    public constructor(
        public readonly userId: number
    ) {
        this.userId = userId;
    }
}