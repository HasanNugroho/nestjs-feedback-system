import { ApiProperty } from "@nestjs/swagger";

export class CredentialResponse {
    @ApiProperty({ example: 'token' })
    accessToken: string;

    @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
    id: string;

    constructor(
        accessToken: string,
        id: string,
    ) {
        this.accessToken = accessToken;
        this.id = id;
    }
}