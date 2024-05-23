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
        
    socket.on('join_room',(data)=>{

        // console.log(data);
        const roomId=`${data.StoredRoomname}-${data.Storedcode}`;
        // console.log(roomId);
        socket.join(roomId);
        // console.log(`${data.Storedname} joined room: ${data.StoredRoomname}`);
        socket.to(roomId).emit('userJoined', { message: `${data.Storedname} has joined the chat` });
    })

    // socket.on("typing", (data) => {
    //     // console.log(data);
    //     const roomId=`${data.room}-${data.code}`;
    //     console.log(roomId);
    //     socket.to(roomId).emit('typing', data);
    //   });
    
    //   socket.on("stopTyping", (data) => {
       
    //     const roomId=`${data.room}-${data.code}`;
    //     console.log(roomId); 
    //     socket.to(roomId).emit("stopTyping", data);
    //   }); 
      
    socket.on('someswar',(data)=>{

        const roomId=`${data.room}-${data.code}`;
        console.log(roomId); 
        console.log(data);
        socket.to(roomId).emit('message',data);

    })
    socket.on('image-file',(data)=>{
        const roomId=`${data.room}-${data.code}`;
        console.log(roomId);
        socket.to(roomId).emit('image-file',{Url:data.Url,type:data.type,name:data.name});

    })
    socket.on('disconnect', () => {
        // console.log('A user disconnected');
    });
});

server.listen(3001, () => {
    console.log(`Server is running on port ${3001}`);
});
