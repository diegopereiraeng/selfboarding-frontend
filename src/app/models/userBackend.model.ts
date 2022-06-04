import { UserBackendRole } from './userBackendRole.model';
import { UserBackendProfile } from './userBackendProfile.model';


export class UserBackend {
    id?: string;
    username?: string;
    email?: string;
    createdAt?: string;
    updatedAt?: string;
    userProfile?: UserBackendProfile;
    active?: UserBackendProfile;
    roles?: Array<UserBackendRole>;
}