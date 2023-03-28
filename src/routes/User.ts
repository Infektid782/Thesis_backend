import express from 'express';
import controller from '../controllers/User';
import verifyToken from '../middleware/VerifyToken';

const router = express.Router();

router.get('/get/:userID', controller.readUser);
router.get('/get/', controller.readAllUsers);
router.patch('/update/:userID', controller.updateUser);
router.delete('/delete/', verifyToken, controller.deleteUser);

export = router;
