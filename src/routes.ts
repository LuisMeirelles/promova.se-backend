import { Router } from 'express';

import UsersController from './controllers/UsersController';
import BandsController from './controllers/BandsController';
import ContractorsController from './controllers/ContractorsController';

import authMiddleware from './middlewares/auth';
import multerUploadConfig from './config/multer';

const routes = Router();

const usersController = new UsersController();
const bandsController = new BandsController();
const contractorsController = new ContractorsController();

routes.post('/users', multerUploadConfig.single('profile_picture'), usersController.store);
routes.get('/users/:id', usersController.show);
routes.get('/users', usersController.index);
routes.post('/users/auth', usersController.auth);

routes.post('/bands', bandsController.store);

routes.post('/contractors', contractorsController.store);

routes.use(authMiddleware);

routes.put('/users/:id', usersController.update);
routes.delete('/users/:id', usersController.delete);

export default routes;
