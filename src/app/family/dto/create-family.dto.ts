import { CreateFamilyMemberDto } from "./create-family-member.dto";

export class CreateFamilyDto {
    public name: string;
    public members: CreateFamilyMemberDto[];

    constructor() {
        this.name = "";
        this.members = [];
    }
}