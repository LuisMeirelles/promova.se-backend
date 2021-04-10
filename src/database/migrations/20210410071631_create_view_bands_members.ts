import { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
    return knex.schema.raw(`
        CREATE VIEW vw_bands_members AS (
            SELECT
                b.id AS band_id,
                b.name AS band,
                b.formation AS band_formation,
                m.id AS member_id,
                m.name AS member
            FROM
                bands b
                JOIN bands_members bm ON b.id = bm.band_id
                JOIN members m ON m.id = bm.member_id
            ORDER BY
                b.name
        )
    `);
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.raw('DROP VIEW vw_bands_members');
}
