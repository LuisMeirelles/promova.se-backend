import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('songs', (table) => {
        table.increments('id');
        table.string('name').notNullable();
        table.string('author').notNullable();
        table.string('musical_style').notNullable();
        table.string('url');
        table.string('message').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.integer('user_id').notNullable().unsigned();
        table.foreign('user_id').references('id').inTable('users').onDelete('cascade').onUpdate('cascade');
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('songs');
}

