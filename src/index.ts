import express, {NextFunction, Request, Response} from 'express';
import {ApiError} from './errors/api-error';

const app = express();
const port = 3000;


const users = [
    { id: 1, name: 'vera', age: 30, email: 'halych@gmail.com', phone: '+380634521369' },
    { id: 2, name: 'petya', age: 36, email: 'halych@gmail.com', phone: '+380634521369' },
    { id: 3, name: 'kolya', age: 20, email: 'halych@gmail.com', phone: '+380634521369' },
    { id: 4, name: 'olesya', age: 25, email: 'halych@gmail.com', phone: '+380634521369' },
    { id: 5, name: 'max', age: 31, email: 'halych@gmail.com', phone: '+380634521369' },
    { id: 6, name: 'anya', age: 28, email: 'halych@gmail.com', phone: '+380634521369' },
    { id: 7, name: 'oleg', age: 21, email: 'halych@gmail.com', phone: '+380634521369' },
    { id: 8, name: 'andrey', age: 24, email: 'halych@gmail.com', phone: '+380634521369' },
    { id: 9, name: 'masha', age: 37, email: 'halych@gmail.com', phone: '+380634521369' },
    { id: 10, name: 'lucy', age: 18, email: 'halych@gmail.com', phone: '+380634521369' },
];

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//
// console.log('Registering GET /users');
app.get('/users', (req: Request, res: Response, next: NextFunction) => {

    try {

        res.send(users);
    } catch (err) {
        next(err);
    }
});

// console.log('Registering GET /users/:userId');
app.get('/users/:userId', (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number(req.params.userId);
        const user = users.find(user => user.id === userId);
        if (!user) throw new ApiError ('User not found',404);
        res.send(user);
    } catch (err) {
        next(err);
    }
});

// console.log('Registering POST /users');
app.post('/users', (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, age, email, phone  } = req.body;
        // TODO validate data

        if (!name || name.length <= 3) {
            throw new ApiError ('Name must be longer than 3 characters', 400);
        }
        if (isNaN(age) || age < 0) {
            throw new ApiError ('Age must be a number greater than or equal to 0', 400);
        }

        const id = users[users.length - 1].id + 1;
        const newUser = { id, name, age, email, phone };
        users.push(newUser);
        res.status(201).send(newUser);
    } catch (err) {
        next(err);
    }
});
//
// console.log('Registering PUT /users/:userId');
app.put('/users/:userId', (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number(req.params.userId);
        const userIndex = users.findIndex(user => user.id === userId);

        if (userIndex === -1) throw new ApiError ('User not found', 404);

        const { name, age, email, phone } = req.body;

        // TODO validate data
        if (!name || name.length <= 3) {
            throw new ApiError ('Name must be longer than 3 characters', 400);
        }

        if (isNaN(age) || age < 0) {
            throw new ApiError ('Age must be a number greater than or equal to 0', 400);
        }

        users[userIndex] = { ...users[userIndex], name, age, email, phone };

        res.status(200).send(users[userIndex]);
    } catch (err) {
        next(err);
    }
});


// console.log('Registering DELETE /users/:userId');
app.delete('/users/:userId', (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number(req.params.userId);
        const userIndex = users.findIndex((user) => user.id === userId);
        if (userIndex === -1) throw new Error ('User not found');

        users.splice(userIndex, 1);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});



    // eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: ApiError, req: Request, res: Response, _next: NextFunction) => {
    res.status(error.status || 500).send(error.message);
});


app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});


