import db from '@utils/db.js';

export default class Move {
    static tableName = 'moves';
  
    static async create({ sessionId, moveNotation, fromState, toState, moveTimestamp }) {
      // Step 1: Retrieve the highest move_sequence for the given session_id
      const lastMove = await db(this.tableName)
        .where({ session_id: sessionId })
        .max('move_sequence as max_sequence')
        .first();

      // Step 2: Calculate the next move_sequence value
      const nextMoveSequence = lastMove && lastMove.max_sequence ? lastMove.max_sequence + 1 : 1;

      // Step 3: Insert the new move with the calculated move_sequence
      return db(this.tableName).insert({
        session_id: sessionId,
        move_sequence: nextMoveSequence,
        move_notation: moveNotation,
        from_state: fromState,
        to_state: toState,
        move_timestamp:moveTimestamp
      }).returning('*');
    }
  
    static async findBySessionId(sessionId) {
      return db(this.tableName).where({ session_id: sessionId });
    }
}