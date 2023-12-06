import { FamilyMember } from "./family-member.model";

export class Family {
    public readonly members: FamilyMember[] = [];

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