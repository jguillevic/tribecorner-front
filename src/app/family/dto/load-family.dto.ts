import { LoadFamilyMemberDto } from "./load-family-member.dto";

export class LoadFamilyDto {
    public id: number;
    public name: string;
    public associationCode: string;
    public members: LoadFamilyMemberDto[];

    constructor() {
        this.id = -1;
        this.name = "";
        this.associationCode = "";
        this.members = [];
    }
}