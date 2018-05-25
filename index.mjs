import { CustomerService } from './services';

async function main() {
    try {
        let customerServiceObject = new CustomerService();
        let filteredCustomers = await customerServiceObject.filterCustomers('bath');

        for (let record of filteredCustomers) {
            console.log(JSON.stringify(record));
        }

        console.log('=========================================');

        let fileteredCustomer = await customerServiceObject.getCustomer(11);

        console.log(JSON.stringify(fileteredCustomer));

        console.log('=========================================');

        let newCustomer = {
            id: 1001,
            name: 'Northwind Traders',
            address: 'Bangalore',
            credit: 23000,
            status: true,
            email: 'info@nwt.com',
            phone: '080-38499384',
            remarks: 'Simple and Sample Record'
        };

        let savedRecord = await customerServiceObject.saveCustomer(newCustomer);

        console.log(JSON.stringify(savedRecord));
    } catch (error) {
        console.log(JSON.stringify(error));
    }
}

main()
    .then(() => console.log('Program Completed!'));