import {
    Request,
    Response
} from 'express';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import db from '../database/connection';

const generateToken = (params = {}): string => {
    dotenv.config();

    const SECRET = process.env.SECRET || '';

    return jwt.sign(params, SECRET, {
        expiresIn: '1d'
    });
};

interface UsersInterface {
    id: number;
    email: string;
    username: string;
    password: string;
    profile_picture: string;
    created_at: Date;
}

class UsersController {

    async store(req: Request, res: Response): Promise<Response> {
        const trx = await db.transaction();

        try {
            const data = {
                ...req.body,
                password: await bcrypt.hash(req.body.password, 10)
            };

            const {
                email,
                username,
                password
            } = data;

            const emailExists = await trx<UsersInterface>('users')
                .where({
                    email
                }).first()
            ;

            if (emailExists) {
                return res.status(400).json({
                    message: 'email already registered'
                });
            }

            const usernameExists = await trx<UsersInterface>('users')
                .where({
                    username
                }).first()
            ;

            if (usernameExists) {
                return res.status(400).json({
                    message: 'username already registered'
                });
            }

            const profile_picture = req.file.buffer.toString('base64');

            const user_id = await trx<UsersInterface>('users')
                .insert({
                    email,
                    username,
                    password,
                    profile_picture
                }, 'id')
            ;

            await trx.commit();

            return res.status(201).json({
                id: user_id[0],
                token: generateToken({id: user_id[0]})
            });
        } catch (err) {
            await trx.rollback();

            console.error(err);

            return res.status(400).json({
                message: 'unexpected error while creating new user',
                error: err
            });
        }
    }

    async index(request: Request, response: Response): Promise<Response> {
        const filters = request.query;

        filters.password ? filters.password = undefined : null;

        try {
            const users = await db<UsersInterface>('users')
                .where({ ...filters });

            return response.status(200).json(
                users.map(
                    user => ({
                        ...user,
                        password: undefined
                    })
                )
            );
        } catch (error) {
            return response.status(400).json({
                message: 'unexpected error while listing users',
                error
            });
        }
    }

    async show(request: Request, response: Response): Promise<Response> {
        const id = parseInt(request.params.id);

        try {
            const user = await db<UsersInterface>('users')
                .where({ id })
                .first();

            return response.status(200).json({
                ...user,
                password: undefined
            });
        } catch (error) {
            return response.status(400).json({
                message: 'unexpected error while showing the user',
                error
            });
        }
    }

    async update(request: Request, response: Response): Promise<Response> {
        const id = parseInt(request.params.id);

        const trx = await db.transaction();

        try {
            await trx<UsersInterface>('users')
                .update({
                    ...request.body,
                    password: await bcrypt.hash(request.body.password, 10)
                })
                .where({ id });

            await trx.commit();

            return response.status(200).send();
        } catch (error) {
            await trx.rollback();

            return response.status(400).json({
                message: 'unexpected error while updating new user',
                error
            });
        }
    }

    async delete(request: Request, response: Response): Promise<Response> {
        const id = parseInt(request.params.id);

        const trx = await db.transaction();

        try {
            await trx<UsersInterface>('users')
                .delete()
                .where({ id });

            await trx.commit();

            return response.status(200).send();
        } catch (error) {
            trx.rollback();

            return response.status(400).json({
                message: 'unexpected error while deleting the user',
                error
            });
        }
    }

    async auth(request: Request, response: Response): Promise<Response> {
        const {
            user,
            password
        } = request.body;

        try {
            const result = await db<UsersInterface>('users')
                .where({
                    email: user
                })
                .orWhere({
                    username: user
                })
                .first();

            if (!result) {
                return response.status(400).send({
                    message: 'user not found'
                });
            }

            if (!await bcrypt.compare(password, result.password)) {
                return response.status(400).send({
                    message: 'incorrect password'
                });
            }

            return response.status(200).json({
                token: generateToken({
                    id: result.id
                }),
                id: result.id
            });
        } catch (error) {
            console.error(error);
            return response.status(400).json({
                message: 'unexpected error while authenticating the user',
                error
            });
        }
    }
}

export default UsersController;
