import {
    Request,
    Response
} from 'express';

import db from '../database/connection';

import { UsersInterface } from './UsersController';

interface SongsInterface {
    id: number;
    name: string;
    author: string;
    musical_style: string;
    url?: string;
    message: string;
    user_id?: number;
    user: UsersInterface;
    created_at: Date;
}

export default class SongsController {
    async store(request: Request, response: Response): Promise<Response> {
        const trx = await db.transaction();

        try {
            await trx<SongsInterface>('songs')
                .insert(request.body);

            await trx.commit();

            return response.status(201).send();
        } catch (error) {
            await trx.rollback();

            return response.status(400).json({
                message: 'Unexpected error while creating new song',
                error
            });
        }
    }

    async index(request: Request, response: Response): Promise<Response> {
        const filters = request.query;

        try {
            const songs = await db<SongsInterface>('songs')
                .where({ ...filters });

            return response.status(200).json(songs);
        } catch (error) {
            return response.status(400).json({
                message: 'Unexpected error while list songs',
                error
            });
        }
    }

    async show(request: Request, response: Response): Promise<Response> {
        const id = request.params.id as unknown as number;

        try {
            const song = await db<SongsInterface>('songs')
                .where({ id })
                .first();

            if(song) {
                song.user = await db<UsersInterface>('users')
                    .select('users.*')
                    .join('songs', 'users.id', '=', 'songs.user_id')
                    .first();
            }

            return response.status(200).json({
                ...song,
                user_id: undefined,
                password: undefined
            });

        } catch (error) {
            return response.status(400).json({
                message: 'Unexpected error while show a songs',
                error
            });
        }
    }

    async update(request: Request, response: Response): Promise<Response> {
        const id = parseInt(request.params.id);

        const trx = await db.transaction();

        try {
            await trx<SongsInterface>('songs')
                .update(request.body)
                .where({ id });

            trx.commit();

            return response.status(200).send();
        } catch (error) {
            await trx.rollback();

            return response.status(400).json({
                message: 'Unexpected error while update new song',
                error
            });
        }
    }

    async delete(request: Request, response: Response): Promise<Response> {
        const id = parseInt(request.params.id);

        try {
            await db<SongsInterface>('songs')
                .delete()
                .where({ id });

            return response.status(200).send();
        } catch (error) {
            return response.status(400).json({
                message: 'Unexpected error while delete the user',
                error
            });
        }
    }
}
