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
  
    static async find(fid, sessionId) {
      return db(this.tableName)
        .where({ fid: fid, status: 'completed',  session_id:sessionId})
        .first();
    }

  // Method to get the leaderboard of fastest solved sessions, including only fid, session_id, and duration in seconds
  static async getLeaderboard(limit = 10) {
    return db(this.tableName)
      .select('fid', 'session_id')
      .select(db.raw('ROUND(EXTRACT(EPOCH FROM (end_time - start_time))) AS duration_seconds')) // Round duration to nearest integer
      .whereNotNull('end_time') // Ensure the session has ended
      .andWhere('status', '=', 'completed') // Filter only completed sessions
      .orderBy('duration_seconds', 'asc') // Order by the rounded duration in ascending order
      .limit(limit); // Limit the number of results
  }

  static async getShortestSolveTime(fid) {
    if (!fid) {
        throw new Error('FID is required');
    }

    const result = await db(this.tableName)
        .select(db.raw('ROUND(EXTRACT(EPOCH FROM (end_time - start_time))) AS duration_seconds'))
        .whereNotNull('end_time') // Ensure the session has ended
        .andWhere('status', '=', 'completed') // Filter only completed sessions
        .andWhere('fid', '=', fid) // Filter by the specific FID
        .orderBy('duration_seconds', 'asc') // Order by duration in ascending order
        .first(); // Retrieve only the shortest duration

    return result ? result.duration_seconds : null; // Return the shortest duration or null if not found
  }

  static async getSolveTime(sessionId) {
    const result = await db(this.tableName)
        .select(db.raw('ROUND(EXTRACT(EPOCH FROM (end_time - start_time))) AS duration_seconds'))
        .whereNotNull('end_time') // Ensure the session has ended
        .andWhere('status', '=', 'completed') // Filter only completed sessions
        .andWhere('session_id', '=', sessionId) // Filter by the specific id
        .first();
        
    return result ? result.duration_seconds : null; // Return the shortest duration or null if not found
  }

  // Method to delete a session by session_id
  static async deleteSessionById(sessionId) {
    return db(this.tableName)
      .where({ session_id: sessionId, status: 'active' })
      .del(); // Use the delete operation provided by your database querying library
  }

  static async getTotalPlayerByStatus(status) {
    return db(this.tableName)
      .where({ status })
      .count({ total_players: 'session_id' }) // Using 'session_id' as it's the primary key
      .first()
      .then(result => result ? parseInt(result.total_players) : 0); // Convert string count to integer and return
  }
}

