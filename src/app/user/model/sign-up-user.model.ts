export class SignUpUser {
    public username: string;
    public email: string;
    public password: string;
    public passwordConfirmation: string;

    constructor() {
        this.username = "";
        this.email = "";
        this.password = "";
        this.passwordConfirmation = "";
    }
}