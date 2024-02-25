import knex from 'knex';

const db = knex({
  client: 'postgres',
  connection: process.env.FC_DATABASE_URL,
  pool: { min: 0, max: 80 },
});

const createUsersTable = async () => {
  const exists = await db.schema.hasTable('users');
  if (!exists) {
    await db.schema.createTable('users', (table) => {
      table.increments('user_id').primary();
      table.bigInteger('fid').notNullable().unique();
    });
    console.log('Table users created');
  } else {
    console.log('Table users already exists');
  }
};

const createSessionsTable = async () => {
  const exists = await db.schema.hasTable('sessions');
  if (!exists) {
    await db.schema.createTable('sessions', (table) => {
      table.increments('session_id').primary();
      table.bigInteger('fid').notNullable();
      table.timestamp('start_time', { useTz: true }).notNullable();
      table.timestamp('end_time', { useTz: true });
      table.enu('status', ['active', 'completed', 'abandoned']).notNullable();
      table.char('initial_state', 59).notNullable();
      table.char('current_state', 59).notNullable();
      table.foreign('fid').references('users.fid');
    });
    console.log('Table sessions created');
  } else {
    console.log('Table sessions already exists');
  }
};

const createMovesTable = async () => {
  const exists = await db.schema.hasTable('moves');
  if (!exists) {
    await db.schema.createTable('moves', (table) => {
      table.increments('move_id').primary();
      table.integer('session_id').notNullable();
      table.integer('move_sequence').notNullable();
      table.string('move_notation', 10).notNullable();
      table.char('from_state', 59).notNullable();
      table.char('to_state', 59).notNullable();
      table.timestamp('move_timestamp', { useTz: true }).defaultTo(db.fn.now());
      table.foreign('session_id').references('sessions.session_id');
    });
    console.log('Table moves created');
  } else {
    console.log('Table moves already exists');
  }
};

export const initialize = async()=>{
  await createUsersTable();
  await createSessionsTable();
  await createMovesTable();
}

export default db;