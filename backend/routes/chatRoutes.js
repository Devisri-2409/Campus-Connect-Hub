const router=require("express").Router();

const verifyToken=require("../middleware/authMiddleware");

const chatController=require("../controllers/chatController");

router.get(

"/:groupId",

verifyToken,

chatController.getMessages

);

router.post(

"/",

verifyToken,

chatController.saveMessage

);

module.exports=router;