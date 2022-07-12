import { RequestHandler } from 'express';
import { QueryArrayResult } from 'pg';
import db from '../db';
import errorHandler from '../utils/errorHandler';

export const createTodo: RequestHandler = async (req, res, next) => {
    const { title, description } = req.body;
    const { userId } = res.locals;
    const data = {
        text: 'INSERT INTO todo(title,description,user_id) VALUES($1,$2,$3) RETURNING todo_id,title,description,complete',
        values: [title, description, userId],
    };

    try {
        const result: QueryArrayResult = await db.query(data);
        if (result.rowCount === 0) throw errorHandler('Fail to create Todo', 400);
        return res.json({ message: 'Todo added successfully', todo: result.rows[0] });
    } catch (err) {
        return next(err);
    }
};

export const getTodo: RequestHandler = async (req, res, next) => {
    const { todoId } = req.query;
    const { userId } = res.locals;
    const data = {
        text: todoId ? 'SELECT todo_id,title,description,complete FROM todo WHERE todo_id=$1 AND user_id=$2' : 'SELECT todo_id,title,description,complete FROM todo WHERE user_id=$1 ORDER BY created_at DESC',
        values: todoId ? [todoId, userId] : [userId],
    };

    try {
        const result: QueryArrayResult = await db.query(data);
        return res.json({ todos: result.rows });
    } catch (err) {
        return next(err);
    }
};


export const updateTodo: RequestHandler = async (req, res, next) => {
    const { todoId } = req.params;
    const { title, description, complete } = req.body;
    const { userId } = res.locals;

    const data = {
        text: 'UPDATE todo SET title=$1,description=$2,complete=$3 WHERE todo_id=$4 AND user_id=$5',
        values: [title, description, complete, todoId, userId],
    };
    try {
        const result: QueryArrayResult = await db.query(data);
        if (result.rowCount === 0) throw errorHandler('Fail to update todo', 400);
        return res.json({ message: 'Todo Updated successfully' });
    } catch (err) {
        return next(err);
    }
};

export const deleteTodo: RequestHandler = async (req, res, next) => {
    const { todoId } = req.params;
    const { userId } = res.locals;

    const data = {
        text: 'DELETE FROM todo WHERE todo_id=$1 AND user_id=$2',
        values: [todoId, userId],
    };
    try {
        const result: QueryArrayResult = await db.query(data);
        if (result.rowCount === 0) throw errorHandler('Fail to delete Todo', 400);
        return res.json({ message: 'Todo deleted succesfully' });
    } catch (err) {
        return next(err);
    }
};
