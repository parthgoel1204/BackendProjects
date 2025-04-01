const express = require('express');
const users = require('./MOCK_DATA.json');
const fs = require('fs');
const app = express();
const PORT = 8000;

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
app.get('/users' , (req,res) => {
  const html = `
  <ul>
  ${users.map((user) => `<li>${user.first_name}</li>`).join('')}
  </ul>`;
  res.send(html);
})
app.get('/api/users' , (req,res) => {
  return res.json({users});
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
app.get('/api/users/:id' , (req,res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);
  if(!user){
    return res.status(404).json({"message" : "User not found"});
  }
  return res.json(user);
})
app.post('/api/users/' , (req,res) => {
  const body = req.body;
  users.push({...body , id:users.length + 1});
  fs.writeFile('./MOCK_DATA.json', JSON.stringify(users) , (err , data)=> {
    if(err) console.log(err);
    return res.status(201).json({ id:users.length});
  })
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
app.patch('/api/users/:id' , (req,res) => {
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