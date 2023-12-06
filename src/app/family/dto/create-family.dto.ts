import { CreateFamilyMemberDto } from "./create-family-member.dto";

export class CreateFamilyDto {
    public constructor(
        public readonly name: string,
        public readonly members: CreateFamilyMemberDto[] = []
    ) { }
}