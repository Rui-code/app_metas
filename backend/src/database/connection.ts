import knex from 'knex';
import DB_CONNECTION from '../../env/db_connection';

const db = knex({
    client: 'pg',
    connection: DB_CONNECTION,
    useNullAsDefault: true,
});

export default db;