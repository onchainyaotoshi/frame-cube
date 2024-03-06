import db from '@utils/db.js';

export default class User {
    static tableName = 'users';
  
    static async create(fid) {
        return db(this.tableName).insert({ fid }).returning('*');
    }
  
    static async findByFid(fid) {
        return db(this.tableName).where({ fid }).first();
    }

    static async createIfNotExists(fid) {
        const user = await this.findByFid(fid);
        if (!user) {
            // User does not exist, create a new user
            const newUser = await this.create(fid);
            return newUser;
        }
        // User already exists, return the existing user
        return user;
    }

    static async count() {
        const result = await db(this.tableName).count('* as total');
        return parseInt(result[0].total, 10);
    }
}