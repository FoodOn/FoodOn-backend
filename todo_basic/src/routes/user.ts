import { Router } from 'express';

/* Import Middlewares */
import isAuthenticated from '../middlewares/index/isAuthenticated';
import userValidation from '../middlewares/user/userValidation';
import validationError from '../middlewares/index/validationError';
import upload from '../serverConfig/multer';

/* Import Controllers */
import {
    getUser, updateUser,
} from '../controllers/user';

const router = Router();

router.get('/', isAuthenticated, getUser);
router.put('/', upload.single('profile'), userValidation, validationError, isAuthenticated, updateUser);


export default router;
