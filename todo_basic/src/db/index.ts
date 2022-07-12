import { Pool, PoolClient } from 'pg';
import config from 'config';
import { DB } from '../types/config';


interface Data {
    text: string;
    values: unknown[];
}

const {
    DB_USER, DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT,
} = config.get('DB') as DB;

const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    port: DB_PORT,
    ssl: {
        rejectUnauthorized: false,
    },
});
const db = {
    query: (data: Data)
        // eslint-disable-next-line no-async-promise-executor
        : Promise<any> => new Promise(async (resolve, reject) => {
        try {
            const client: PoolClient = await pool.connect();
            const res = await client.query(data);
            client.release();
            resolve(res);
        } catch (err) {
            reject(err);
        }
    }),
};

export default db;
