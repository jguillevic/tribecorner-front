import { CreateFamilyMemberDto } from "./create-family-member.dto";

export class CreateFamilyDto {
    public readonly members: CreateFamilyMemberDto[] = [];

    public constructor(
        public readonly name: string
    ) {
        this.name = name;
    }
}