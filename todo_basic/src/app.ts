import express, { NextFunction, Request, Response } from 'express';
import config from 'config';
import cors from 'cors';
import StatusError from './class/statusError';
import getImage from './utils/getImage';
import { SERVER } from './types/config';

/* Routes Export */
import userRouter from './routes/user';
import todoRouter from './routes/todo';
import authRouter from './routes/auth';
import errorHandler from './utils/errorHandler';

/* Config */
const { SERVER_PORT } = config.get('SERVER') as SERVER;

/* Express App */
const app = express();

/* Middleware */
app.use(express.json());
app.use(cors());

/* Routes */
app.use('/user', userRouter);
app.use('/todo', todoRouter);
app.use('/auth', authRouter);
app.use('/image/:fileName', async (req: Request, res: Response, next: NextFunction) => {
    const { fileName } = req.params;
    try {
        const data = await getImage(fileName);
        return res.send(data);
    } catch (err: any) {
        return next(err);
    }
});
app.use('/', (req: Request, res: Response, next: NextFunction) => next(errorHandler('Invalid route', 400)));

/* Error Handler */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: StatusError, req: Request, res: Response, next: NextFunction) => res
    .status(err.status || 500).json({
        message: err.message,
    }));

/* Server Start */
app.listen(SERVER_PORT, () => {
    console.log(`Server Started at port ${SERVER_PORT}`);
});
