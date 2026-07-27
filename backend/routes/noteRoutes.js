const express = require("express");
const multer = require("multer");

const verifyToken = require("../middleware/authMiddleware");

const controller = require("../controllers/noteController");

const router = express.Router();

const storage = multer.diskStorage({

    destination:"uploads/",

    filename:(req,file,cb)=>{

        cb(null,Date.now()+"-"+file.originalname);

    }

});

const upload = multer({storage});

router.post(
    "/",
    verifyToken,
    upload.single("file"),
    controller.uploadNote
);

router.get(
    "/",
    verifyToken,
    controller.getAllNotes
);

module.exports=router;