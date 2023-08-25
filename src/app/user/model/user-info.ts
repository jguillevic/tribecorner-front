export class UserInfo {
    public id: number | undefined;
    public firebaseId: string
    public email: string;
    public firstName: string;
    public lastName: string;

    constructor() {
        this.firebaseId = "";
        this.email = "";
        this.firstName = "";
        this.lastName = "";
    }
}