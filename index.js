const express=require('express');
const app=express();
const PORT=3001

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

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
