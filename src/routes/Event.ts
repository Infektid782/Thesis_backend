import express from 'express';
import controller from '../controllers/Event';
import verifyToken from '../middleware/VerifyToken';

const router = express.Router();

router.post('/create', verifyToken, controller.createEvent);
router.get('/get/:eventID', controller.readEvent);
router.get('/get', controller.readAllEvents);
router.patch('/update/:eventID', verifyToken, controller.updateEvent);
router.delete('/delete/:eventID', verifyToken, controller.deleteEvent);

export = router;
