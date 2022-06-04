export class User {
    id?: string;
    name?: string;
    username?: string;
    email?: string;
    type?: string;

    public constructor(name?: string, username?: string, email?: string, type?: string) {
        if (name !== undefined) {
            this.name = name;
        }
        if (username !== undefined) {
            this.username = username;
        }
        if (email !== undefined) {
            this.email = email;
        }
        if (type !== undefined) {
            this.type = type;
        }
    }
}
