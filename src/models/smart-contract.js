import db from '@utils/db.js';

export default class SmartContract {
    static tableName = 'smart_contracts';

    // Method to create a new smart contract record
    static async create({ ticker, abi, address, amount, status }) {
        return db(this.tableName).insert({
            ticker,
            abi: abi, // Ensure the ABI is stored as a stringified JSON
            address,
            amount,
            status
        }).returning('*'); // Return the inserted record
    }

    // Method to find smart contract records by ticker
    static async findByTicker(ticker) {
        // Return the first matching record or null if not found
        return db(this.tableName).where({ ticker }).first();
    }

    // Method to update the status of a smart contract by its ticker
    static async updateStatus(ticker, status) {
        return db(this.tableName).where({ ticker }).update({ status }).returning('*');
    }

    
}