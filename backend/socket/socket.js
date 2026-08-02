const socketio = require("socket.io");

let io;

const initSocket = (server) => {

    io = socketio(server,{
        cors:{
            origin:"*"
        }
    });

    io.on("connection",(socket)=>{

        console.log("User Connected");

        socket.on("joinGroup",(groupId)=>{

            socket.join("group_"+groupId);

        });

        socket.on("sendMessage",(data)=>{

            io.to("group_"+data.group_id)
            .emit("receiveMessage",data);

        });

        socket.on("disconnect",()=>{

            console.log("Disconnected");

        });

    });

};

const getIO=()=>io;

module.exports={
    initSocket,
    getIO
};