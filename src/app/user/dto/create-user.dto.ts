export class CreateUserDto {
    public firebaseId: string;
    public email: string;
    public username: string;

    constructor() {
        this.firebaseId = "";
        this.email = "";
        this.username = "";
    }
}