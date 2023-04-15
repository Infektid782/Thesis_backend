import express from 'express';
import controller from '../controllers/Group';
import verifyToken from '../middleware/VerifyToken';

const router = express.Router();

router.post('/create', verifyToken, controller.createGroup);
router.get('/get/:groupID', controller.readGroup);
router.get('/get_for_user/', verifyToken, controller.readGroupsForUser);
router.get('/get_all/', controller.readAllGroups);
router.patch('/update/:groupID', verifyToken, controller.updateGroup);
router.delete('/delete/:groupID', verifyToken, controller.deleteGroup);

export = router;
