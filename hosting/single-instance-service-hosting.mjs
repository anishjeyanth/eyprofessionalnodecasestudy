import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';

import { ErrorConstants, ServiceUrlConstants } from '../constants';
import { CustomerRouting } from '../routing';

class SingleInstanceServiceHosting {
    constructor(portNumber) {
        if (!portNumber) {
            throw new Error(ErrorConstants.INVALID_ARGUMENTS);
        }

        this.portNumber = portNumber;
        this.expressApplication = express();
        this.httpServer = http.createServer(this.expressApplication);
        this.customerRouting = new CustomerRouting();

        this.initializeHost();
    }

    initializeHost() {
        this.applyCors();
        this.expressApplication.use(bodyParser.json());
        this.expressApplication.use(ServiceUrlConstants.CUSTOMERS, this.customerRouting.Router);
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
