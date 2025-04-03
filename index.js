const express = require('express');
// const users = require('./MOCK_DATA.json');
const fs = require('fs');
const mongoose = require('mongoose');
const { type } = require('os');
const { generateKey } = require('crypto');
const app = express();
const PORT = 8000;
// Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/project01")
  .then(() => { console.log("MongoDB connected")})
  .catch((err) => console.log("MongoDB connection error", err));
  
const userSchema = new mongoose.Schema({
  first_name : {
    type : String,
    required : true,
  },
  last_name : {
    type : String,
    required : true,
  },
  email : {
    type : String,
    required : true,
    unique : true,
  }
},
{timestamps : true}
);
const User = mongoose.model('user' , userSchema);
// Middleware - plugin
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use((req,res,next) => {
  console.log("Hello from middleware one !");
  next();
});
// app.use((req,res,next) => {
//   console.log("Hello from middleware two !");
//   return res.end('Hey');
// });
// Routes
app.get('/users' , async (req,res) => {
  const usersFromDb = await User.find();
  const html = `
  <ul>
  ${usersFromDb.map((user) => `<li>${user.first_name} - ${user.email}</li>`).join('')}
  </ul>`;
  res.send(html);
})
app.get('/api/users' ,async (req,res) => {
  const usersFromDb = await User.find();
  return res.json({usersFromDb});
})
// app.route('/api/users/:id')
// .get((req,res) => {
//   const id = Number(req.params.id);
//   const user = users.find((user) => user.id === id);
//   return res.json(user);
// })
// .put((req,res) => {
//   return res.json( { status : "pending"})
// })
// .patch((req,res) => {
//   return res.json( { status : "pending"})
// })
// .delete((req,res) => {
//   return res.json( { status : "pending"})
// })
app.get('/api/users/:id' ,async (req,res) => {
  const usersFromDb = await User.findById(req.params.id);
  if(!usersFromDb){
    return res.status(404).json({"message" : "User not found"});
  }
  return res.json(usersFromDb);
})
app.post('/api/users/' ,async (req,res) => {
  const body = req.body;
  if(
    !body||
    !body.first_name ||
    !body.last_name ||
    !body.email||
    !body.gender
  ) {
    return res.status(400).json({message : "ALL Fields are required!"});
  }
  const result = await User.create({
    first_name : body.first_name,
    last_name : body.last_name,
    email : body.email,
    gender : body.gender,
  });
  console.log(result);
  return res.status(201).json({message :"Success"});
  
  // users.push({...body , id:users.length + 1});
  // fs.writeFile('./MOCK_DATA.json', JSON.stringify(users) , (err , data)=> {
  //   if(err) console.log(err);
  //   return res.status(201).json({ id:users.length});
  // })
})
app.put('/api/users/:id' , (req,res) => {
  const id = Number(req.params.id);
  const body = req.body;
  const userIndex = users.findIndex((user) => user.id === id);
  if(userIndex == -1)
    return res.json({status : "failed" , message : "User not found"});
  users[userIndex] = {...users[userIndex] , ...body};
  fs.writeFile('./MOCK_DATA.json', JSON.stringify(users) , (err , data)=> {
    if(err) {
      console.log(err);
      return res.status(500).json({error : "File Write Error"});
    }
    return res.json({status : "success" , body: users[userIndex]});
  })
})
app.patch('/api/users/:id' ,async (req,res) => {
  const usersFromDb = await User.findByIdAndUpdate(req.params.id , {last_name : "Goel"});
  return res.status(200).json({message :"Success"});
  // const id = Number(req.params.id);
  // const body = req.body;
  // const userIndex = users.findIndex((user) => user.id === id);
  // if(userIndex == -1)
  //   return res.json({status : "failed" , message : "User not found"});

  // users[userIndex] = {...users[userIndex] , ...body};
  // fs.writeFile('./MOCK_DATA.json', JSON.stringify(users) , (err , data)=> {
  //   if(err) {
  //     console.log(err);
  //     return res.status(500).json({error : "File Write Error"});
  //   }
  //   return res.json({status : "success" , body: users[userIndex]});
  // })
})
app.delete('/api/users/:id' , (req,res) => {
  const id = Number(req.params.id);
  const userIndex = users.findIndex((user) => user.id === id);
  if(userIndex == -1)
    return res.json({status : "failed" , message : "User not found"});
  const deletedUser = users.splice(userIndex , 1);
  fs.writeFile('./MOCK_DATA.json', JSON.stringify(users) , (err , data)=> {
    if(err) {
      console.log(err);
      return res.status(500).json({error : "File Write Error"});
    }
    return res.json({status : "success" , deletedUser});
  })
})

app.listen(PORT , () => {
  console.log(`Server started at PORT: ${PORT} `);
})