import { DbService } from './db-service';
import { getConfiguration } from '../config';
import { ErrorConstants } from '../constants';

const MIN_SEARCH_LENGTH = 3;

async function connect() {
    let connectionString = getConfiguration().ConnectionString;

    await DbService.Connection.connect(connectionString);
}

async function disconnect() {
    await DbService.Connection.disconnect();
}

class CustomerService {
    async getCustomers() {
        let customers = null;

        try {
            await connect();

            customers = await DbService.Customers.find({});
        } catch (error) {
            console.log(`Error Occurred, Details : ${JSON.stringify(error)}`);

            throw error;
        } finally {
            await disconnect();
        }

        return customers;
    }

    async filterCustomers(customerName) {
        let filteredCustomers = null;
        let validation = customerName && customerName.length >= MIN_SEARCH_LENGTH;

        if (!validation)
            throw new Error(ErrorConstants.BUSINESS_VALIDATION_FAILED);

        try {
            await connect();

            filteredCustomers = await DbService.Customers.find({
                name: new RegExp(customerName, 'i')
            });
        } catch (error) {
            console.log(`Error Occurred, Details : ${JSON.stringify(error)}`);

            throw error;
        } finally {
            await disconnect();
        }

        return filteredCustomers;
    }

    async getCustomer(customerId) {
        if (!customerId)
            throw new Error(ErrorConstants.INVALID_ARGUMENTS);

        let filteredCustomer = null;

        try {
            await connect();

            filteredCustomer = await DbService.Customers.findOne({
                id: customerId
            });
        } catch (error) {
            console.log(`Error Occurred, Details : ${JSON.stringify(error)}`);

            throw error;
        } finally {
            await disconnect();
        }

        return filteredCustomer;
    }

    async saveCustomer(customer) {
        let validation = customer && customer.id && customer.name &&
            customer.address && customer.credit && customer.status && customer.remarks &&
            customer.email && customer.phone;

        if (!validation)
            throw new Error(ErrorConstants.BUSINESS_VALIDATION_FAILED);

        let savedCustomerRecord = null;

        try {
            await connect();

            savedCustomerRecord = await DbService.Customers.create(customer);
        } catch (error) {
            console.log(`Error Occurred, Details : ${JSON.stringify(error)}`);

            throw error;
        } finally {
            await disconnect();
        }

        return savedCustomerRecord;
    }
}

export {
    CustomerService
};
