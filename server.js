const express = require('express');
const path = require('path');
const apiRouter = require('./api');
const {port} = require('./config');


const server = express();


server.use(express.static(path.join(__dirname,'client/build')));
server.use(express.static(path.join(__dirname,'librarian/build')));
server.use('/api',apiRouter);

server.get('/lib', (req,res) => {
    res.sendFile(path.join(__dirname,'librarian/build/index.html'));
})

server.get('*', (req,res) => {
    res.sendFile(path.join(__dirname,'client/build/index.html'));
})

server.listen(port, ()=> console.log(`listening to port: ${port}`));



