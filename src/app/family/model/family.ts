import { FamilyMember } from "./familyMember";

export class Family {
    public id: number | undefined;
    public name: string;
    public members: FamilyMember[];

    constructor() {
        this.name = '';
        this.members = new Array();
    }
}