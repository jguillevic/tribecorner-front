export class FamilyMember {
    public id: number|undefined;
    public name: string;
    public userId: number;
    public username: string;

    constructor() {
        this.name = '';
        this.userId = -1;
        this.username = "";
    }
}