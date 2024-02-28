import db from '@utils/db.js';

export default class WelcomeAirdrop {
    static tableName = 'welcome_airdrops';
  
    // Method to create a new airdrop record
    static async create({ fid, token, amount, address, session_id }) {
        return db(this.tableName).insert({
            fid,
            token,
            amount,
            address,
            session_id
        }).returning('*'); // Return the inserted record
    }
  
    // Method to find airdrop records by fid (user's foreign ID)
    static async findByFid(fid) {
        // Return the first matching record or null if not found
        return db(this.tableName).where({ fid }).first();
    }
}