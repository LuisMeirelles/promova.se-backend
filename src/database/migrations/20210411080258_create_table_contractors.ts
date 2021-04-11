import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('contractors', table => {
        table.increments();
        table.string('name');
        table.integer('user_id')
            .notNullable()
            .unsigned()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .index()
        ;
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('contractors');
}
