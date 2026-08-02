const chatModel=require("../models/chatModel");

exports.getMessages=(req,res)=>{

chatModel.getMessages(

req.params.groupId,

(err,result)=>{

if(err)
return res.status(500).json(err);

res.json(result);

});

};

exports.saveMessage=(req,res)=>{

const data={

group_id:req.body.group_id,

user_id:req.user.user_id,

message:req.body.message

};

chatModel.saveMessage(

data,

(err)=>{

if(err)
return res.status(500).json(err);

res.json({

success:true

});

});

};