import express from 'express';
import jwt from 'jsonwebtoken';

import { AuthenticationService, UserProfileService } from '../services';
import { HttpStatusCodes, ErrorConstants } from '../constants';

const TEN_MINUTES = '10m';

class AuthenticationRouting {
    constructor(secretKey) {
        if (!secretKey) {
            throw new Error(ErrorConstants.INVALID_ARGUMENTS);
        }

        this.secretKey = secretKey;
        this.routerDefinition = express.Router();
        this.authenticationService = new AuthenticationService();
        this.userProfileService = new UserProfileService();

        this.initializeRouting();
    }

    initializeRouting() {
        this.routerDefinition.post('/', async (request, response) => {
            try {
                let userName = request.body.userName || request.body.userId;
                let password = request.body.password;
                let validation = userName && password;

                if (!validation) {
                    response
                        .status(HttpStatusCodes.BAD_REQUEST)
                        .send({
                            reason: ErrorConstants.INVALID_ARGUMENTS
                        });

                    return;
                }

                let authenticationStatus =
                    this.authenticationService.authenticate(userName, password);
                    
                if (!authenticationStatus) {
                    response.status(HttpStatusCodes.UNAUTHORIZED)
                        .send({
                            reason: ErrorConstants.INVALID_PROFILE
                        });

                    return;
                }

                let userProfile = this.userProfileService.getUserProfile(userName);
                let securedUserProfile = {
                    userProfileId: userProfile.userId,
                    title: userProfile.title,
                    isActive: userProfile.isActive,
                    email: userProfile.email
                };

                let signedToken = jwt.sign(securedUserProfile, this.secretKey, {
                    expiresIn: TEN_MINUTES
                });

                response
                    .status(HttpStatusCodes.OK)
                    .send({
                        token: signedToken
                    });
            } catch (error) {
                console.log(JSON.stringify(error));
                response
                    .status(HttpStatusCodes.BAD_REQUEST)
                    .send({
                        reason: ErrorConstants.UNKNOWN_ERROR
                    });
            }
        });
    }

    get Router() {
        return this.routerDefinition;
    }
}

export {
    AuthenticationRouting
};
