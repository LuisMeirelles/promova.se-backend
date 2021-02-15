import express from 'express';

import UsersController from './controllers/UsersController';
import SongsController from './controllers/SongsController';

import authMiddleware from './middlewares/auth';

const routes = express.Router();

const usersController = new UsersController();
const songsController = new SongsController();

routes.post('/users/auth', usersController.auth);
routes.post('/users', usersController.store);
routes.get('/users', usersController.index);
routes.get('/users/:id', usersController.show);

routes.get('/songs', songsController.index);
routes.get('/songs/:id', songsController.show);

routes.use(authMiddleware);

routes.put('/users/:id', usersController.update);
routes.delete('/users/:id', usersController.delete);

routes.post('/songs', songsController.store);
routes.put('/songs/:id', songsController.update);
routes.delete('/songs/:id', songsController.delete);

export default routes;
