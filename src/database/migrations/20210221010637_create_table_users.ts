import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', table => {
        table.increments();
        table.string('email').notNullable();
        table.string('username').notNullable();
        table.string('password').notNullable();
        table.specificType('profile_picture', 'MEDIUMBLOB').notNullable();
        table.timestamp('created_at', {
            precision: 3,
            useTz: true
        }).defaultTo(knex.fn.now(3));
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('users');
}
