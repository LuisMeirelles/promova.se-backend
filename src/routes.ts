import express, {
    Request,
    Response
} from 'express';
import multer from 'multer';

import UsersController from './controllers/UsersController';
import SongsController from './controllers/SongsController';

import authMiddleware from './middlewares/auth';

import multerConfig from './config/multer';

const routes = express.Router();

const usersController = new UsersController();
const songsController = new SongsController();

routes.post('/users/auth', usersController.auth);
routes.post('/users', usersController.store);
routes.get('/users', usersController.index);
routes.get('/users/:id', usersController.show);

routes.get('/songs', songsController.index);
routes.get('/songs/:id', songsController.show);

routes.post('/upload', multer(multerConfig).single('file'), (req: Request, res: Response) => {
    const {
        originalname: name,
        size,
        filename: key,
    } = req.file;

    const imageData = {
        name,
        size,
        key,
        url: ''
    };

    return res.json(imageData);
});

routes.use(authMiddleware);

routes.put('/users/:id', usersController.update);
routes.delete('/users/:id', usersController.delete);

routes.post('/songs', songsController.store);
routes.put('/songs/:id', songsController.update);
routes.delete('/songs/:id', songsController.delete);

export default routes;
