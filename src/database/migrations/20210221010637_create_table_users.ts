import * as Knex from 'knex';


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', table => {
        table.increments('id');
        table.string('email').notNullable();
        table.string('username').notNullable();
        table.string('password').notNullable();
        table.specificType('profile_picture', 'MEDIUMBLOB').notNullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('users');
}

