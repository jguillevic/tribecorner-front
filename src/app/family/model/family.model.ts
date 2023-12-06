import { FamilyMember } from "./family-member.model";

export class Family {
    public constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly associationCode: string,
        public readonly members: FamilyMember[] = []
    ) { }
}