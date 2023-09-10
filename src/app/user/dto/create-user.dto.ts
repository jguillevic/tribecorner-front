import { SignUpUser } from "../model/sign-up-user.model";

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