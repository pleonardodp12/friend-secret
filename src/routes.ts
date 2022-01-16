import express from 'express';
import ParticipantsController from './controllers/participants';
import SecretController from './controllers/secret';

const routes = express.Router();

const participantsController = new ParticipantsController
const secretController = new SecretController

routes.post('/dev/secret', secretController.create);
routes.get('/dev/secret/:id', secretController.get);
routes.put('/dev/secret/:id/draw', secretController.drawPost);
routes.post('/dev/secret/:id/participants', participantsController.create)
routes.delete('/dev/secret/:id/participants/:participantId', participantsController.deleteParticipant)

export default routes;