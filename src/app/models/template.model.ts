/* import { UserBackendRole } from './userBackendRole.model';
import { UserBackendProfile } from './userBackendProfile.model'; */

/* export interface UserSignup {
    name: string; 
    username: string; 
    password: string;
    email: string; 
} */

export class Template {
    accountId?: string
    identifier?: string
    name?: string
    description?: string
    tags?: object
    enabled?: Boolean
    yaml?: string
    yamlInput?: string
    versionLabel?: string
    templateEntityType?: string
    templateScope?: string
    version?: any
    lastUpdatedAt?: number
    createdAt?: number
    stableTemplate?: boolean
    gitDetails?: object
    entityValidityDetails?: object
}