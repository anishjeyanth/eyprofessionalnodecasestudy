import mongoose from 'mongoose';
import { getConfiguration } from '../config';
import { CustomerModel } from '../models';

let CustomerMappedModel = mongoose.model('customers', CustomerModel);

class DbService {
    static get Connection() {
        return mongoose;
    }

    static get Customers() {
        return CustomerMappedModel;
    }
}

export {
    DbService
};
