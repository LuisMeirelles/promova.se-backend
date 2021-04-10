import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('bands', table => {
        table.increments();
        table.string('name').notNullable();
        table.enum('formation', ['solo', 'dupla', 'banda']).notNullable();
        table.integer('user_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .index();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('bands');
}
