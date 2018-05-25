import sio from 'socket.io';
import { ErrorConstants } from '../constants';
import { RandomGenerator } from '../utilities';

class PushNotificationService {
    constructor(httpServer) {
        if (!httpServer) {
            throw new Error(ErrorConstants.INVALID_ARGUMENTS);
        }

        this.httpServer = httpServer;
        this.socketServer = sio.listen(this.httpServer);
        this.socketServer.on('connection', socketClient => {
            socketClient.socketClientId = RandomGenerator.generate();

            console.log(`Socket Client ${socketClient.socketClientId} Connected ...`);

            socketClient.on('disconnect', () => {
                console.log(`Socket Client ${socketClient.socketClientId} Disconnected ...`);
            });
        });
    }

    notify(eventName, eventData) {
        let validation = eventName && eventData;

        if (!validation) {
            throw new Error(ErrorConstants.INVALID_ARGUMENTS);
        }

        this.socketServer.emit(eventName, eventData);
    }
}

export {
    PushNotificationService
};
