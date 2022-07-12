/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.raw(
    `CREATE TABLE image(
        name TEXT,
        url TEXT,
        file_name TEXT,
        user_id UUID PRIMARY KEY REFERENCES user_account ON DELETE CASCADE
    );`,
);

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.raw('DROP TABLE image;');
