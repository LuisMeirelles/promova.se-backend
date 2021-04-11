import {
    Request,
    Response
} from 'express';

import db from '../database/connection';

interface BandsInterface {
    id: number;
    name: string;
    formation: string;
    members: string[];
    user_id: number;
}

interface MembersInterface {
    id: number;
    name: string;
}

interface BandsMembersInterface {
    id: number;
    band_id: number;
    member_id: number;
}

class BandsController {
    async store(request: Request, response: Response): Promise<Response> {
        const trx = await db.transaction();

        try {
            const {
                name,
                formation,
                user_id
            } = request.body;

            const band_id = await trx<BandsInterface>('bands')
                .insert({
                    name,
                    formation,
                    user_id
                }, 'id')
            ;

            const members: string[] = JSON.parse(request.body.members);

            for (const member of members) {
                const member_id = await trx<MembersInterface>('members')
                    .insert({
                        name: member
                    }, 'id')
                ;

                await trx<BandsMembersInterface>('band_members')
                    .insert({
                        band_id: band_id[0],
                        member_id: member_id[0]
                    })
                ;
            }

            await trx.commit();

            return response.sendStatus(200);
        } catch (err) {
            await trx.rollback();

            console.error(err);

            return response.status(400).json({
                message: 'unexpected error while creating new band user',
                error: err
            });
        }
    }
}

export default BandsController;
