import { ApiProperty } from "@nestjs/swagger";

export class CredentialResponse {
    @ApiProperty({
        description: 'The access token for authentication',
        example: 'token',
    })
    accessToken: string;

    @ApiProperty({
        description: 'The unique identifier of the user',
        example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    })
    id: string;

    constructor(
        accessToken: string,
        id: string,
    ) {
        this.accessToken = accessToken;
        this.id = id;
    }
}