import express from 'express';
import { CustomerService } from '../services';
import { PushNotificationEvents, HttpStatusCodes, ErrorConstants } from '../constants';

const MIN_SEARCH_LENGTH = 3;
const MIN_CUSTOMER_ID = 1;

class CustomerRouting {
    constructor(pushNotificationService) {
        this.customerService = new CustomerService();
        this.pushNotificationService = pushNotificationService;
        this.routerDefinition = express.Router();

        this.initializeRouting();
    }

    initializeRouting() {
        this.routerDefinition.get('/', async (request, response) => {
            try {
                let customers = await this.customerService.getCustomers();

                response
                    .status(HttpStatusCodes.OK)
                    .send(customers);
            } catch (error) {
                response
                    .status(HttpStatusCodes.SERVER_ERROR)
                    .send({
                        reason: ErrorConstants.UNKNOWN_ERROR
                    });
            }
        });

        this.routerDefinition.get('/search/:customerName', async (request, response) => {
            try {
                let customerName = request.params.customerName;
                let validation = customerName && customerName.length >= MIN_SEARCH_LENGTH;

                if (!validation) {
                    response
                        .status(HttpStatusCodes.BAD_REQUEST)
                        .send({
                            status: ErrorConstants.INVALID_ARGUMENTS
                        });

                    return;
                }

                let filteredCustomers = await this.customerService.filterCustomers(customerName);

                response
                    .status(HttpStatusCodes.OK)
                    .send(filteredCustomers);
            } catch (error) {
                response
                    .status(HttpStatusCodes.SERVER_ERROR)
                    .send({
                        status: ErrorConstants.UNKNOWN_ERROR
                    });
            }
        });

        this.routerDefinition.get('/detail/:customerId', async (request, response) => {
            try {
                let customerId = parseInt(request.params.customerId);
                let validation = customerId && customerId >= MIN_CUSTOMER_ID;

                if (!validation) {
                    response.status(HttpStatusCodes.BAD_REQUEST)
                        .send({
                            reason: ErrorConstants.INVALID_ARGUMENTS
                        });

                    return;
                }

                let filteredCustomer = await this.customerService.getCustomer(customerId);

                response.status(HttpStatusCodes.OK)
                    .send(filteredCustomer);
            } catch (error) {
                response
                    .status(HttpStatusCodes.SERVER_ERROR)
                    .send({
                        status: ErrorConstants.UNKNOWN_ERROR
                    });
            }
        });

        this.routerDefinition.post('/', async (request, response) => {
            try {
                let customer = request.body;
                let validation = customer && (customer.id || customer.customerId) &&
                    customer.name && customer.status;

                if (!validation) {
                    response
                        .status(HttpStatusCodes.BAD_REQUEST)
                        .send({
                            reason: ErrorConstants.INVALID_ARGUMENTS
                        });

                    return;
                }

                customer.id = customer.id || customer.customerId;

                let savedCustomerRecord = await this.customerService.saveCustomer(customer);

                if (this.pushNotificationService) {
                    this.pushNotificationService.notify(
                        PushNotificationEvents.NEW_CUSTOMER, savedCustomerRecord);
                }

                response
                    .status(HttpStatusCodes.CREATED)
                    .send(savedCustomerRecord);
            } catch (error) {
                response
                    .status(HttpStatusCodes.SERVER_ERROR)
                    .send({
                        status: ErrorConstants.UNKNOWN_ERROR
                    });
            }
        });
    }

    get Router() {
        return this.routerDefinition;
    }
}

export {
    CustomerRouting
};
