import { SingleInstanceServiceHosting } from './hosting';

const DEFAULT_PORT = 8080;
const DEFAULT_SECRET_KEY = 'EY, Bangalore';

async function main() {
    try {
        let portNumber = process.env.PORT_NUMBER || DEFAULT_PORT;
        let enableStaticContents = process.env.ENABLE_STATIC_CONTENTS;
        let secretKey = process.env.GLOBAL_SECRET_KEY || DEFAULT_SECRET_KEY;
        let hosting = new SingleInstanceServiceHosting(portNumber, enableStaticContents, secretKey);

        await hosting.startServer();

        console.log('Server Started Successfully ...');

        let handleStopServer = async () => {
            await hosting.stopServer();

            console.log('Server Stopped Successfully ...');
        };

        process.on('exit', handleStopServer);
        process.on('SIGTERM', handleStopServer);
    } catch (error) {
        console.log(`Error Occurred, Details : ${JSON.stringify(error)}`);
    }
}

main()
    .then(() => console.log('Program Completed ...'));