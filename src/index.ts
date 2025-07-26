import express, {NextFunction, Request, Response} from 'express';
import {ApiError} from './errors/api-error';
import {userRouter} from './routers/user.router';
import {configs} from './configs/config';
import * as mongoose from 'mongoose';
import {authRouter} from './routers/auth.router';
import {cronRunner} from './crons';


const app = express();

const port = configs.APP_PORT;
const host = configs.APP_HOST;
const mongo = configs.MONGO_URI;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.use('/users', userRouter);
app.use('/auth', authRouter);


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: ApiError, req: Request, res: Response, _next: NextFunction) => {
    res.status(error.status || 500).send(error.message);
});

process.on('uncaughtException', (error) => {
    console.error('uncaughtException', error.message, error.stack);
    process.exit(1);
});

app.listen(port, async ()  => {
 await mongoose.connect(mongo);

    cronRunner();
    console.log(`Server started on http://${host}:${port}`);
});

///

