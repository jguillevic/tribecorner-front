export class UserInfo {
    public id: number;
    public uid: string
    public email: string;
    public firstname: string;
    public lastname: string;

    constructor() {
        this.id = -1;
        this.uid = "";
        this.email = "";
        this.firstname = "";
        this.lastname = "";
    }
}