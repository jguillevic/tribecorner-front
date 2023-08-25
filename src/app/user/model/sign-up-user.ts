export class SignUpUser {
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public passwordConfirmation: string;

    constructor() {
        this.firstName = "";
        this.lastName = "";
        this.email = "";
        this.password = "";
        this.passwordConfirmation = "";
    }
}