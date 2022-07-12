import { RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from 'config';
import errorHandler from '../../utils/errorHandler';
import { SERVER } from '../../types/config';

const isAuthenticated: RequestHandler = (req, res, next) => {
    const token = req.header('authorization');
    const { SERVER_JWT_SECRET_KEY } = config.get('SERVER') as SERVER;
    try {
        if (!token) throw errorHandler('You are not authenticated', 400);
        const extractToken = token.split(' ')[1];
        const result = jwt.verify(extractToken, SERVER_JWT_SECRET_KEY);
        if (!result) throw errorHandler('You are not authenticated', 400);
        const { userId } = result as JwtPayload;
        res.locals.userId = userId;
        return next();
    } catch (err) {
        return next(err);
    }
};

export default isAuthenticated;
