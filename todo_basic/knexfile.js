// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const config = require('config');

const { DB_USER, DB_DATABASE, DB_PASSWORD } = config.get('DB');

module.exports = {
    development: {
        client: 'postgresql',
        connection: {
            database: DB_DATABASE,
            user: DB_USER,
            password: DB_PASSWORD,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
        },
    },

    production: {
        client: 'postgresql',
        connection: {
            database: DB_DATABASE,
            user: DB_USER,
            password: DB_PASSWORD,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
        },
    },
};
