import knex from 'knex';

const db = knex({
  client: 'postgres',
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 80 },
});

export const createRubikGameTable = async () => {
    const exists = await db.schema.hasTable('rubik_game');
    if (!exists) {
        await db.schema.createTable('rubik_game', (table) => {
            table.increments('id');
            table.bigInteger('fid').unsigned().notNullable();
            table.timestamp('start', { useTz: true }).notNullable();
            table.timestamp('end', { useTz: true });
            table.string('current_state'); // No default value
            table.string('address');
            table.string('tx_hash');
            table.string('message');
          });
      console.log('Table rubik_game created');
    } else {
      console.log('Table rubik_game already exists');
    }
  };

export const insertGame = async (gameData) => {
  // Insert logic here
  const [id] = await db('rubik_game').insert(gameData).returning('id');
  return id;
};

export const updateGame = async (id, gameData) => {
  // Update logic here
  await db('rubik_game').where({ id }).update(gameData);
};

export const deleteGame = async (id) => {
  // Delete logic here
  await db('rubik_game').where({ id }).del();
};

export const getIdByFidAndNullEnd = async (fid) => {
    const result = await db('rubik_game').where({ fid, end: null }).select('id').first();
    return result ? result.id : null;
};

export const updateCurrentStateByFid = async (fid, newState) => {
    await db('rubik_game')
      .where({ fid, end: null })
      .update({ current_state: newState });
};

export const getCurrentStateByFid = async (fid) => {
    const result = await db('rubik_game')
      .where({ fid, end: null })
      .select('current_state')
      .first();
    return result ? result.current_state : null;
};

export const  updateStartAndStateByFid = async (fid, newStart, newState) => {
    await db('rubik_game')
      .where({ fid, end: null })
      .update({ start: newStart, current_state: newState });
  };

  export const  finish = async (fid, end) => {
    await db('rubik_game')
      .where({ fid, end: null })
      .update({ end: end });
  };

  export const checkOngoingGameByFid = async (fid) => {
    const game = await db('rubik_game').where({ fid, end: null }).select('current_state').first();
    return game ? game.current_state : null; // Returns current_state if a game exists, null otherwise
  };

  export const isRewardClaimed = async (fid) => {
    const game = await db('rubik_game')
      .where({ fid })
      .whereNotNull('tx_hash')
      .whereNotNull('end')
      .first();
  
    return !!game; // Returns true if such a game exists, false otherwise
  };
  
  export const updateAddressAndTxHash = async (fid, address, txHash) => {
    try {
      const record = await db('rubik_game')
        .where({ fid, address: null, tx_hash:null })
        .whereNotNull('end')
        .first()
  
      if(record){
          await db('rubik_game')
          .where({ id: record.id }) // Use the fetched ID for updating
          .update({
            address: address,
            tx_hash: txHash
          });

        return record.id; // Return the ID of the updated record
      } else {
        console.log('No matching record found for update');
        return null; // Return null if no record was found to update
      }
    } catch (error) {
      console.error('Error updating address and transaction hash:', error);
      return false; // In case of error, return false
    }
  };

