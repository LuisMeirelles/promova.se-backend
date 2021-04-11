import {
    Request,
    Response
} from 'express';

import db from '../database/connection';

interface ContractorsInterface {
    id: number;
    name: string;
    user_id: number;
}

class ContractorsController {

    async store(request: Request, response: Response): Promise<Response> {
        const trx = await db.transaction();

        try {
            const {
                name,
                user_id
            } = request.body;

            await trx<ContractorsInterface>('contractors')
                .insert({
                    name,
                    user_id
                }, 'id')
            ;

            await trx.commit();

            return response.sendStatus(200);
        } catch (err) {
            await trx.rollback();

            console.error(err);

            return response.status(400).json({
                message: 'unexpected error while creating new contractor user',
                error: err
            });
        }
    }
}

export default ContractorsController;
