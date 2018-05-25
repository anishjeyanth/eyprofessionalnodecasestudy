import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';

import { ErrorConstants, ServiceUrlConstants } from '../constants';
import { CustomerRouting } from '../routing';
import { PushNotificationService } from '../services';

const DEFAULT_STATIC_CONTENTS_FLAG = false;

class SingleInstanceServiceHosting {
    constructor(portNumber, enableStaticContents = DEFAULT_STATIC_CONTENTS_FLAG) {
        if (!portNumber) {
            throw new Error(ErrorConstants.INVALID_ARGUMENTS);
        }

        this.enableStaticContents = enableStaticContents;
        this.portNumber = portNumber;
        this.expressApplication = express();
        this.httpServer = http.createServer(this.expressApplication);
        this.pushNotificationService = new PushNotificationService(this.httpServer);
        this.customerRouting = new CustomerRouting(this.pushNotificationService);

        this.initializeHost();
    }

    initializeHost() {
        this.applyCors();
        this.expressApplication.use(bodyParser.json());
        this.expressApplication.use(ServiceUrlConstants.CUSTOMERS, this.customerRouting.Router);

        if (this.enableStaticContents) {
            this.expressApplication.use('/', express.static('public'));
        }
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
