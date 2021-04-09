import {
    Request,
    Response,
    NextFunction
} from 'express';

import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';

interface TokenPayload {
    id: string,
    iat: number,
    exp: number
}

export default (req: Request, res: Response, next: NextFunction): Response | void => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).send({ error: 'no token provided' });
    }

    const parts = authorization.split(' ');
    const [scheme, token] = parts;

    if (parts.length !== 2 || !/^Bearer$/i.test(scheme)) {
        console.log(parts);
        return res.status(401).send({ error: 'malformed token' });
    }

    dotenv.config();

    try {
        const SECRET = process.env.SECRET || '';

        const data = jwt.verify(token, SECRET);

        const { id } = data as TokenPayload;

        req.userId = id;

        next();
    } catch {
        return res.status(401).send({ error: 'invalid token' });
    }
};
