import { LoadFamilyMemberDto } from "./load-family-member.dto";

export class LoadFamilyDto {
    public readonly members: LoadFamilyMemberDto[] = [];

    public constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly associationCode: string
    ) {
        this.id = id;
        this.name = name;
        this.associationCode = associationCode;
    }
}