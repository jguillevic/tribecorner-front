export class FamilyMember {
    public constructor(    
        public readonly id: number,
        public readonly name: string,
        public readonly userId: number,
        public readonly username: string
    ) {
        this.id = id;
        this.name = name;
        this.userId = userId;
        this.username = username;
    }
}