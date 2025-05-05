import { CredentialResponse } from "../dtos/credential-response.dto";
import { Credentials } from "../dtos/credential.dto";

export interface IAuthService {
    /**
     * Authenticate user with identifier and password.
     * @param credential - User login input (email and password)
     * @returns Access and refresh tokens
     */
    login(credential: Credentials): Promise<CredentialResponse>;
}