import { ObjectFormatter } from '../utilities';

class UserProfile {
    constructor(userId, password, email, title, isActive) {
        [
            this.userId, this.password,
            this.email, this.title, this.isActive
        ] = arguments;
    }

    toString() {
        return ObjectFormatter.format(this);
    }
}

export {
    UserProfile
};
