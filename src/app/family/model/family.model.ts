import { FamilyMember } from "./family-member.model";

export class Family {
    public id: number|undefined;
    public name: string;
    public associationCode: string;
    public members: FamilyMember[];

    constructor() {
        this.name = '';
        this.associationCode = "";
        this.members = [];
    }
}