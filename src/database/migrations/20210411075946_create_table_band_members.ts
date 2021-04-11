import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('band_members', table => {
        table.increments();

        table.integer('member_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('members')
            .onDelete('CASCADE')
            .index();

        table.integer('band_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('bands')
            .onDelete('CASCADE')
            .index();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('band_members');
}
