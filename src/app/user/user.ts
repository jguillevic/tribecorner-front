export class User {
    id: number;
    uid: string
    email: string;
    firstname: string;
    lastname: string;

    constructor() {
        this.id = -1;
        this.uid = "";
        this.email = "";
        this.firstname = "";
        this.lastname = "";
    }
}