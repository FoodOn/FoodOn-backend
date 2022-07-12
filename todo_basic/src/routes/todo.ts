import { Router } from 'express';

/* Import Middlewares */
import isAuthenticated from '../middlewares/index/isAuthenticated';
import todoValidation from '../middlewares/todo/todoValidation';
import validationError from '../middlewares/index/validationError';

/* Import Controllers */
import {
    createTodo, getTodo, updateTodo, deleteTodo,
} from '../controllers/todo';

const router = Router();

router.post('/', todoValidation, validationError, isAuthenticated, createTodo);
router.get('/', isAuthenticated, getTodo);
router.put('/:todoId', todoValidation, validationError, isAuthenticated, updateTodo);
router.delete('/:todoId', isAuthenticated, deleteTodo);

export default router;
