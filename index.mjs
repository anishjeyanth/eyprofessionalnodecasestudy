import { SingleInstanceServiceHosting } from './hosting';

const DEFAULT_PORT = 8080;

async function main() {
    try {
        let portNumber = process.env.PORT_NUMBER || DEFAULT_PORT;
        let enableStaticContents = process.env.ENABLE_STATIC_CONTENTS;
        let hosting = new SingleInstanceServiceHosting(portNumber, enableStaticContents);

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