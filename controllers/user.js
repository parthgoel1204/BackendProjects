const User = require("../models/user");

async function handleGetAllUsers(req, res) {
  const usersFromDb = await User.find();
  return res.json({usersFromDb});
}
async function handleGetUsersById(req, res) {
    const usersFromDb = await User.findById(req.params.id);
    if(!usersFromDb){
      return res.status(404).json({"message" : "User not found"});
    }
    return res.json(usersFromDb);
  }

async function handleUpdateById(req,res){
  const usersFromDb = await User.findByIdAndUpdate(req.params.id , {last_name : "Goel"});
  return res.status(200).json({message :"Success"});
}
async function handleDeleteById(req,res){
  const usersFromDb = await User.findByIdAndDelete(req.params.id);
  if(!usersFromDb){
    return res.status(404).json({"message" : "User not found"});
  }
  return res.status(200).json({message :"Success"});
}
async function handleCreateNewUser(req,res){
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
}
module.exports = {
  handleGetAllUsers , 
  handleGetUsersById ,
  handleUpdateById ,
  handleDeleteById ,
  handleCreateNewUser
}