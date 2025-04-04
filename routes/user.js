const express = require('express');
const router = express.Router();
const {handleGetAllUsers , handleGetUsersById , handleUpdateById , handleDeleteById , handleCreateNewUser} = require('../controllers/user');
const fs = require('fs');

// router.get('/' , async (req,res) => {
//   const usersFromDb = await User.find();
//   const html = `
//   <ul>
//   ${usersFromDb.map((user) => `<li>${user.first_name} - ${user.email}</li>`).join('')}
//   </ul>`;
//   res.send(html);
// })
router.get('/' ,handleGetAllUsers);
router.get('/:id' , handleGetUsersById);
router.post('/' , handleCreateNewUser);

router.put('/:id' , (req,res) => {
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

router.patch('/:id' ,handleUpdateById);

router.delete('/api/users/:id' ,handleDeleteById);
  module.exports = router;