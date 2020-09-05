import express from 'express';
import UnidadesController from './controllers/UnidadesController';
import UsersMetaController from './controllers/UsersMetaController';

const routes =  express.Router();

routes.get('/unidades', UnidadesController.index);
routes.get('/unidades/:id', UnidadesController.getOne);
routes.post('/unidades', UnidadesController.create);

routes.get('/usersMeta', UsersMetaController.index);
routes.get('/usersMeta/:id', UsersMetaController.getOne);
routes.post('/usersMeta', UsersMetaController.create);
routes.put('/usersMeta/:id', UsersMetaController.update);
routes.delete('/usersMeta', UsersMetaController.delete);

export default routes;