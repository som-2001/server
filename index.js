const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io")(server, {
  cors: { origin: "*" },
  maxHttpBufferSize: 1e8,
});

app.use(
  cors({
    origin: ["*"],
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.get("/", (req, res) => {
  res.send(`<h1>Hello World!</h1>`);
});

app.get("/api/docker", (req, res) => {
  res.send(`<h1>Hello Docker!</h1>`);
});

app.post("/api/message", (req, res) => {
  console.log(req.body.message);
  res.send(req.body.message);
});
app.post("/api/message1", (req, res) => {
  res.send("wowwwww!!!!");
});

var users = [];
var members = [];
var socketIdStore=[];

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    const roomId = `${data.StoredRoomname}-${data.Storedcode}`;
    if (
      !users.includes(data.StoredRoomname) &&
      !users.includes(data.Storedname) &&
      !users.includes(data.Storedcode)
    ) {
      users[socket.id] = {
        name: data.Storedname,
        room: data.StoredRoomname,
        code: data.Storedcode,
      };
    }
    socket.join(roomId);
  
    socket.to(roomId).emit("userJoined", {
      message: `${data.Storedname} has joined the chat`,
    });
  });

  socket.on("someswar", (data) => {
    const roomId = `${data.room}-${data.code}`;
    socket.to(roomId).emit("message", data);
  });
  socket.on("image-file", (data) => {
    const roomId = `${data.room}-${data.code}`;
    socket
      .to(roomId)
      .emit("image-file", { Url: data.Url, type: data.type, name: data.name,getCurrentTime:data.getCurrentTime  });
  });
  socket.on("total_member", (data) => {

    const roomId = `${data.room}-${data.code}`;
  
    for (const socketId in users) {
      const user = users[socketId];
      
      if (!socketIdStore.includes(socketId) && String(user.room) == String(data.room)) {
        members.push({socketId:socketId,name:user.name});
        socketIdStore.push(socketId);
       
      }
    }
    io.to(roomId).emit('total_member',{members:members})
  });

  socket.on("deleteMessage",(data)=>{
    const roomId = `${data.room}-${data.code}`;
    io.to(roomId).emit('deleteMessage',data);
  })

  socket.on("typing", (data) => {

    const roomId = `${data.room}-${data.code}`;
    socket.to(roomId).emit('typing', data);
  });

  socket.on("stopTyping", (data) => {

    const roomId = `${data.room}-${data.code}`;
    socket.to(roomId).emit("stopTyping", data);

  });
  socket.on("disconnect", () => {
    
    const roomId = `${users[socket.id]?.room}-${users[socket.id]?.code}`;
    
    members=members.filter((item)=>item.socketId!==socket.id)
    socketIdStore=socketIdStore.filter(item=>item!==socket.id);

    socket.to(roomId).emit("left_room", { user: users[socket.id]?.name,members:members });
    delete users[socket.id];

  });
});

server.listen(3001, () => {
  console.log(`Server is running on port ${3001}`);
});
