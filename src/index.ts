import express, {NextFunction, Request, Response} from 'express';
import {ApiError} from './errors/api-error';
import {userRouter} from './routers/user.router';
import {configs} from './configs/config';
import * as mongoose from 'mongoose';


const app = express();

const port = configs.APP_PORT;
const host = configs.APP_HOST;
// const mongo = configs.MONGO_URI;



app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/users', userRouter);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: ApiError, req: Request, res: Response, _next: NextFunction) => {
    res.status(error.status || 500).send(error.message);
});


app.listen(port, async ()  => {
 await mongoose.connect(configs.MONGO_URI);


    console.log(`Server started on https://${host}:${port}`);
});


