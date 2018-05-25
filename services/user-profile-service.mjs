import { UserProfile } from '../models';
import { ErrorConstants } from '../constants';

class UserProfileService {
    constructor() {
        this.userProfiles =
            [
                new UserProfile('USR100011', 'admin@123', 'usr100011@email-info.com', 'Executive', true),
                new UserProfile('USR100012', 'admin@123', 'usr100012@email-info.com', 'Executive', true),
                new UserProfile('USR100013', 'admin@123', 'usr100013@email-info.com', 'Executive', true),
                new UserProfile('USR100014', 'admin@123', 'usr100014@email-info.com', 'Executive', false),
                new UserProfile('USR100015', 'admin@123', 'usr100015@email-info.com', 'Executive', true),
                new UserProfile('USR100016', 'admin@123', 'usr100016@email-info.com', 'Executive', true),
                new UserProfile('USR100017', 'admin@123', 'usr100017@email-info.com', 'Executive', true),
                new UserProfile('USR100018', 'admin@123', 'usr100018@email-info.com', 'Executive', true)
            ];
    }

    getUserProfile(userProfileId) {
        if (!userProfileId) {
            throw new Error(ErrorConstants.INVALID_ARGUMENTS);
        }

        let filteredProfile = null;

        for (let profile of this.userProfiles) {
            if (profile.userId === userProfileId) {
                filteredProfile = profile;
                break;
            }
        }

        return filteredProfile;
    }
}

export {
    UserProfileService
};
