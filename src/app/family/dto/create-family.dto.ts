import { FamilyMemberDto } from "./family-member.dto";

export class CreateFamilyDto {
    public constructor(
        public readonly name: string,
        public readonly members: FamilyMemberDto[] = []
    ) { }
}