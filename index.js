const express=require('express');
const app=express();
const server=require('http').createServer(app);
const cors=require('cors');
const io=require('socket.io')(server,{ cors: { origin: '*' }, maxHttpBufferSize: 1e8 });

app.use(
    cors({
      origin: ["*"],
      methods: ["GET", "POST", "PUT"],
      credentials: true,
    })
  ); 

  app.use(express.json({ limit: '50mb' })); 
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
    
    socket.broadcast.emit('userJoined', { message: 'A new user has joined' });
    
    socket.on('someswar',(data)=>{

        socket.broadcast.emit('message',data);

    })
    socket.on('image-file',(data)=>{

        console.log(data);
        socket.broadcast.emit('image-file',{Url:data.Url,type:data.type});

    })
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(3001, () => {
    console.log(`Server is running on port ${3001}`);
});
