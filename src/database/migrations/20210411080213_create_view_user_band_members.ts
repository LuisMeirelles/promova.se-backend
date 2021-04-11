import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.raw(`
        CREATE VIEW vw_user_band_members AS (
            SELECT
                u.id AS user_id,
                u.email,
                u.username,
                u.password,
                u.profile_picture,
                u.created_at,
                b.id AS band_id,
                b.name AS band,
                b.formation,
                m.id AS member_id,
                m.name AS member
            FROM
                bands b
                JOIN band_members bm ON b.id = bm.band_id
                JOIN members m ON m.id = bm.member_id
                JOIN users u ON u.id = b.user_id
            ORDER BY
                u.username
        )
    `);
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.raw('DROP VIEW vw_user_band_members');
}
