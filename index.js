// Закінчити з CRUD операціями.
// При створенні робити валідацію на імʼя і вік,
// імʼя повинно бути більше за 3 символи, вік – не менше нуля
// На гет, пут, деліт юзерів перевірити чи такий юзер є в базі.
// якщо немає – вивести помилку
// Використовуйте шляхи для нових ендпоінтів згідно REST правил

const express = require('express');
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
app.use(express.urlencoded({ extended: true }));

app.get('/users', (req, res) => {
    try {
        res.send(users);
    } catch (err) {
        res.status(500).send('Error');
    }
});


app.get('/users/:userId', (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const user = users.find(user => user.id === userId);
        if (!user) return res.status(404).send('User not found');
        res.send(user);
    } catch (err) {
        res.status(500).send('Error');
    }
});


app.post('/users', (req, res) => {
    try {
        const { name, age, email, phone  } = req.body;
      // TODO validate data

        if (!name || name.length <= 3) {
            return res.status(400).send('Name must be longer than 3 characters');
        }
        if (isNaN(age) || age < 0) {
            return res.status(400).send('Age must be a number greater than or equal to 0');
        }

        const id = users[users.length - 1].id + 1;
        const newUser = { id, name, age, email, phone };
        users.push(newUser);
        res.status(201).send(newUser);
    } catch (err) {
        res.status(500).send('Error');
    }
});


app.put('/users/:userId', (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const userIndex = users.findIndex(user => user.id === userId);

        if (userIndex === -1) return res.status(404).send('User not found');

        const { name, age, email, phone } = req.body;

        // TODO validate data
        if (!name || name.length <= 3) {
            return res.status(400).send('Name must be longer than 3 characters');
        }
        if (isNaN(age) || age < 0) {
            return res.status(400).send('Age must be a number greater than or equal to 0');
        }

        users[userIndex] = { ...users[userIndex], name, age, email, phone };

        res.status(200).send(users[userIndex]);
    } catch (err) {
        res.status(500).send('Error');
    }
});



app.delete('/users/:userId', (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const userIndex = users.findIndex((user) => user.id === userId);
        if (userIndex === -1) return res.status(404).send('User not found');

        users.splice(userIndex, 1);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).send('Error');
    }
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});

