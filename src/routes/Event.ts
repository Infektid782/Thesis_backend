import express from 'express';
import controller from '../controllers/Event';

const router = express.Router();

router.post('/create', controller.createEvent);
router.get('/get/:eventID', controller.readEvent);
router.get('/get/', controller.readAllEvents);
router.patch('/update/:eventID', controller.updateEvent);
router.delete('/delete/:eventID', controller.deleteEvent);

export = router;
