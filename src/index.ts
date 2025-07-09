// const express = require('express');


import express, { Request, Response} from 'express';
const app = express();
const port = 3000;


const users = [
    {id:1,name: 'vera', email: 'halych@gmail.com', phone: '+380634521369'},
    {id:2,name: 'petya', email: 'halych@gmail.com', phone: '+380634521369'},
    {id:3,name: 'kolya',  email: 'halych@gmail.com', phone: '+380634521369'},
    {id:4,name: 'olesya', email: 'halych@gmail.com', phone: '+380634521369'},
    {id:5,name: 'max',  email: 'halych@gmail.com', phone: '+380634521369'},
    {id:6,name: 'anya', email: 'halych@gmail.com', phone: '+380634521369'},
    {id:7,name: 'oleg', email: 'halych@gmail.com', phone: '+380634521369'},
    {id:8,name: 'andrey', email: 'halych@gmail.com', phone: '+380634521369'},
    {id:9,name: 'masha', email: 'halych@gmail.com', phone: '+380634521369'},
    {id:10,name: 'lucy', email: 'halych@gmail.com', phone: '+380634521369'},

];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/users',  (req:Request, res:Response)=> {
    try{
        res.send (users);
    }
    catch(err){
        res.status(500).send(err.message);
    }

});
app.post('/users',  (req:Request, res:Response)=> {
    try{
        const {name,email,phone} = req.body;
        // TODO validate data
        const id = users[users.length - 1].id+1;
        const newUser = {id,name,email,phone};
        users.push(newUser);
        res.status (201).send (newUser);
    }
    catch(err){
        res.status(500).send(err.message);
    }

});
//
// app.delete('/users/:userId',  (req:Request, res:Response)=> {
//     try{
//         const userId = Number(req.params.userId);
//         const userIndex =users.findIndex((user) => user.id === userId);
//         if (userIndex ===-1){
//             return res.status(404).send('User not found');
//         }
//         users.splice(userIndex, 1);
//         res.sendStatus(204);
//     }catch(err){
//         res.status(500).send(err.message);
//
//     }
//
// });
// app.put ('/users/:userId', (req:Request, res:Response)=> {
//     try{
//         const userId = Number(req.params.userId);
//         const userIndex =users.findIndex((user) => user.id === userId);
//         if (userIndex ===-1){
//             return res.status(404).send('User not found');
//         }
//         const {name,email,phone}=req.body;
//         // TODO validate data
//
//         users[userIndex].name = name;
//         users[userIndex].email = email;
//         users[userIndex].phone = phone;
//         res.sendStatus(201).send (users[userIndex]);
//
//     }catch(err){
//         res.status(500).send(err.message);
//     }
//
// });

app.get('/users/:userId',  (req:Request, res:Response)=> {
    try{
   const userId = Number(req.params.userId);
   const                         user = users.find(user=>user.id === userId);
    res.send (user);
    }
    catch(err){
        res.status          (500).send(err.message);
    }
});

app.post('/users',                   (req:Request, res:Response)=> {
    // console.log(req.body);
    // console.log(req.query);
    res.send ('Hello world!');
});

app.post                 ('/users/:userId',  (req:Request, res:Response)=> {
    console.log(req.body);
    console.log(req.params);
    console.log(req.query);
    res.send ('Hello world!');
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${ port }`);
});


