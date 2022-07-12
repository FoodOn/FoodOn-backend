import { Router } from 'express';

/* Import Middlewares */
import signupValidation from '../middlewares/auth/signupValidation';
import signinValidation from '../middlewares/auth/signinValidation';
import validationError from '../middlewares/index/validationError';
import upload from '../serverConfig/multer';

/* Import Controllers */
import {
    signup, signin, getGoogleLoginUrl, verifyUser,
} from '../controllers/auth';

const route = Router();

route.post('/signup', upload.single('profile'), signupValidation, validationError, signup);
route.post('/signin', signinValidation, validationError, signin);

route.get('/getGoogleLoginUrl', getGoogleLoginUrl);
route.post('/verifyUser', verifyUser);
export default route;
