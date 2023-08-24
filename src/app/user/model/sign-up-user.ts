export class SignUpUser {
    public firstname: string;
    public lastname: string;
    public email: string;
    public password: string;
    public passwordConfirmation: string;

    constructor() {
        this.firstname = "";
        this.lastname = "";
        this.email = "";
        this.password = "";
        this.passwordConfirmation = "";
    }
}