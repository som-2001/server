const express=require('express');
const app=express();
const server=require('http').createServer(app);
const io=require('socket.io')(server);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.send(`<h1>Hello World!</h1>`);
})

app.get('/api/docker',(req,res)=>{
    res.send(`<h1>Hello Docker!</h1>`);
})

app.post('/api/message',(req,res)=>{
    console.log(req.body.message);
    res.send(req.body.message);
})
app.post('/api/message1',(req,res)=>{
    res.send('wowwwww!!!!');
})

io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('someswar',(data)=>{

        console.log('message received',data);
        socket.broadcast.emit('message',data);
    })
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(3001, () => {
    console.log(`Server is running on port ${3001}`);
});
