import { ConfigurationTypes } from './configuration-types';
import { Configuration } from './dev-config';
import { ErrorConstants } from '../constants';

let currentConfigurationType = ConfigurationTypes.DEV;

function getConfiguration() {
    if (currentConfigurationType === ConfigurationTypes.DEV) {
        return Configuration;
    }

    throw new Error(ErrorConstants.NOT_IMPLEMENTED);
}

function setConfiguration(configurationType) {
    currentConfigurationType = configurationType;
}

export {
    getConfiguration,
    setConfiguration,
    ConfigurationTypes
};
