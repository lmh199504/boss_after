




module.exports = function io(server){
    const io = require('socket.io')(server);
    io.on('connection',(socket)=>{
        //监听connection（用户连接）事件，socket为用户连接的实例
        socket.on('disconnect',()=>{
            //监听用户断开事件
            console.log("用户"+socket.id+"断开连接");
        });
        console.log("用户"+socket.id+"连接");
        socket.on('sendMsg',(data)=>{
            //监听msg事件（这个是自定义的事件）
            console.log(data);//你好服务器
            socket.emit('receiveMsg',{time:new Date().getTime(),msg:"你好客户端"});
            //io.emit("receiveMsg","向所有的客户端发送消息.")
            console.log(socket.id)
            //向socket用户发送信息
        })



    })
}


