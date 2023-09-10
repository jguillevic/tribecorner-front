export class LoadUserDto {
    public id: number;
    public firebaseId: string;
    public email: string;
    public username: string;
    public familyId: number|undefined;

    constructor() {
        this.id = 0;
        this.firebaseId = "";
        this.email = "";
        this.username = "";
    }
}