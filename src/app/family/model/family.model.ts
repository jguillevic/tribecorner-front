import { FamilyMember } from "./family-member.model";

export class Family {
    public id: number;
    public name: string;
    public associationCode: string;
    public members: FamilyMember[];

    constructor() {
        this.id = -1;
        this.name = '';
        this.associationCode = "";
        this.members = [];
    }
}