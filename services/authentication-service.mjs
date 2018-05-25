import { UserProfileService } from './user-profile-service';
import { UserProfile } from '../models';
import { ErrorConstants } from '../constants';

class AuthenticationService {
    constructor() {
        this.userProfileService = new UserProfileService();
    }

    authenticate(userName, password) {
        let validation = userName && password;

        if (!validation)
            throw new Error(ErrorConstants.INVALID_ARGUMENTS);

        let userProfile = this.userProfileService.getUserProfile(userName);

        if (!userProfile)
            throw new Error(ErrorConstants.INVALID_PROFILE);

        let authenticationStatus = userProfile.userId === userName &&
            userProfile.password === password;

        return authenticationStatus;
    }
}

export {
    AuthenticationService
};