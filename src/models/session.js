import db from '@utils/db.js';

export default class Session {
  static tableName = 'sessions';

  // Keep the original create method simple and focused on creating a new session
  static async create({ fid, startTime, initialState }) {
    return db(this.tableName).insert({
      fid,
      start_time: startTime,
      initial_state: initialState,
      current_state: initialState,
      status: 'active'
    }).returning('*');
  }

  // New method to handle the creation of a session if an active one doesn't exist for the fid
  static async createIfNotExists({ fid, startTime, initialState }) {
    const existingSession = await this.findActiveByFid(fid);
    if (!existingSession) {
      // If no active session exists, create a new one
      return this.create({ fid, startTime, initialState });
    } else {
      // If an active session exists, return it
      return existingSession;
    }
  }

  // Method to find an active session by fid
  static async findActiveByFid(fid) {
    return db(this.tableName)
      .where({ fid: fid, status: 'active' })
      .first();
  }
  
  // Method to update the current_state of a session
  static async updateCurrentState(sessionId, currentState) {
    return db(this.tableName)
      .where({ session_id: sessionId })
      .update({
        current_state: currentState
      })
      .returning('*'); // Return the updated session object
  }

    // Method to mark a session as completed
    static async markSessionAsCompleted(sessionId, endTime) {
      return db(this.tableName)
        .where({ session_id: sessionId })
        .update({
          status: 'completed',
          end_time: endTime // Use the current date and time as the end time
        })
        .returning('*'); // Return the updated session object
    }
  
  
}

