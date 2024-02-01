import { FamilyMemberDto } from "./family-member.dto";

export class LoadFamilyDto {
    public constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly associationCode: string,
        public readonly members: FamilyMemberDto[] = []
    ) { }
}