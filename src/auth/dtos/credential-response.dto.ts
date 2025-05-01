export class CredentialResponse {
    accessToken: string;
    id: string;

    constructor(
        accessToken: string,
        id: string,
    ) {
        this.accessToken = accessToken;
        this.id = id;
    }
}