import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';

import { ErrorConstants, ServiceUrlConstants } from '../constants';
import { CustomerRouting, AuthenticationRouting } from '../routing';
import { PushNotificationService } from '../services';

const DEFAULT_STATIC_CONTENTS_FLAG = false;

class SingleInstanceServiceHosting {
    constructor(portNumber, enableStaticContents = DEFAULT_STATIC_CONTENTS_FLAG, secretKey) {
        if (!portNumber) {
            throw new Error(ErrorConstants.INVALID_ARGUMENTS);
        }

        if (!secretKey) {
            throw new Error(ErrorConstants.INVALID_SECRET_KEY);
        }

        this.secretKey = secretKey;
        this.enableStaticContents = enableStaticContents;
        this.portNumber = portNumber;
        this.expressApplication = express();
        this.httpServer = http.createServer(this.expressApplication);
        this.pushNotificationService = new PushNotificationService(this.httpServer);
        this.customerRouting = new CustomerRouting(this.pushNotificationService);
        this.authenticationRouting = new AuthenticationRouting(this.secretKey);

        this.initializeHost();
    }

    initializeHost() {
        this.applyCors();
        this.expressApplication.use(bodyParser.json());
        this.attachUnauthorizedErrorHandler();
        
        this.expressApplication.use(ServiceUrlConstants.CUSTOMERS,
            expressJwt({
                secret: this.secretKey
            }));

        this.expressApplication.use(ServiceUrlConstants.CUSTOMERS, this.customerRouting.Router);
        this.expressApplication.use(ServiceUrlConstants.AUTHENTICATION, this.authenticationRouting.Router);

        if (this.enableStaticContents) {
            this.expressApplication.use('/', express.static('public'));
        }
    }

    attachUnauthorizedErrorHandler() {
        this.expressApplication.use(
            (error, request, response, next) => {
                if (error && error.constructor.name === 'UnauthorizedError') {
                    response.status(HttpStatusCodes.UNAUTHORIZED)
                        .send({
                            reason: ErrorConstants.AUTHENTICATION_FAILED
                        });

                    return;
                }

                next();
            });
    }

    applyCors() {
        this.expressApplication.use(
            (request, response, next) => {
                response.header('Access-Control-Allow-Credentials', 'true');
                response.header('Access-Control-Allow-Origin', '*');
                response.header('Access-Control-Allow-Methods', '*');
                response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

                next();
            });
    }

    startServer() {
        let promise = new Promise((resolve, reject) => {
            this.httpServer.listen(this.portNumber, () => resolve());
        });

        return promise;
    }

    stopServer() {
        let promise = new Promise((resolve, reject) => {
            this.httpServer.close(() => resolve());
        });

        return promise;
    }
}

export {
    SingleInstanceServiceHosting
};
