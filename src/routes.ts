import express, {Response, Request} from 'express';
import ParticipantsController from './controllers/participants';
import SecretController from './controllers/secret';
// import ConnectionsController from './controllers/ConnectionsController';

const routes = express.Router();
// const classesControllers = new ClassesController;
// const connectionsControllers = new ConnectionsController;

const participantsController = new ParticipantsController
const secretController = new SecretController

//routes.post('/dev/partcipants', participantsController.create);
routes.post('/dev/secret', secretController.create);
routes.get('/dev/secret/:id', secretController.get);
routes.put('/dev/secret/:id/draw', secretController.drawPost);
routes.post('/dev/secret/:id/participants', participantsController.create)
routes.delete('/dev/secret/:id/participants/:participantId', participantsController.deleteParticipant)
// routes.post('/classes', classesControllers.create);

// routes.get('/connections', connectionsControllers.index);
// routes.post('/connections', connectionsControllers.create);

export default routes;