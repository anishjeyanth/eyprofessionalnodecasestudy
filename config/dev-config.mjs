import { DbConstants } from '../constants';

class Configuration {
    static get Host() {
        let host = process.env.MONGO_HOST || DbConstants.DEFAULT_HOST;

        return host;
    }

    static get PortNumber() {
        let portNumber = process.env.MONGO_PORT || DbConstants.DEFAULT_PORT;

        return portNumber;
    }

    static get DbName() {
        let dbName = process.env.MONGO_DB || DbConstants.DEFAULT_DB;

        return dbName;
    }

    static get ConnectionString() {
        let connectionString = 
            `mongodb://${Configuration.Host}:${Configuration.PortNumber}/${Configuration.DbName}`;

        return connectionString;
    }
}

export {
    Configuration
};
