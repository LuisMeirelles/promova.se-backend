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

interface UserInterface {
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

            const emailExists = await trx<UserInterface>('users')
                .where({
                    email
                }).first()
            ;

            if (emailExists) {
                return res.status(400).json({
                    message: 'email already registered'
                });
            }

            const usernameExists = await trx<UserInterface>('users')
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

            const user_id = await trx<UserInterface>('users')
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
            const users = await db<UserInterface>('users')
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
            const user = await db<UserInterface>('users')
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
            await trx<UserInterface>('users')
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
            await trx<UserInterface>('users')
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
            password,
            token
        } = request.body;

        if (token) {
            const id = jwt.decode(token, {json: true})?.id;

            if (id) {
                const userData = await db<UserInterface>('users')
                    .where({
                        id
                    })
                    .first();

                return response.status(200).json({
                    ...userData,
                    password: undefined,
                    token
                });
            }

            return response.sendStatus(200);
        } else if (password && user) {
            try {
                const userData = await db<UserInterface>('users')
                    .where({
                        email: user
                    })
                    .orWhere({
                        username: user
                    })
                    .first();

                if (!userData) {
                    return response.status(400).send({
                        message: 'user not found'
                    });
                }

                if (!await bcrypt.compare(password, userData.password)) {
                    return response.status(400).send({
                        message: 'incorrect password'
                    });
                }

                return response.status(200).json({
                    ...userData,
                    password: undefined,
                    token: generateToken({
                        id: userData.id
                    })
                });
            } catch (error) {
                console.error(error);
                return response.status(400).json({
                    message: 'unexpected error while authenticating the user',
                    error
                });
            }
        }

        return response.sendStatus(401);
    }
}

export default UsersController;
