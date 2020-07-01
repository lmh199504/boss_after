

const { ChatModel } = require('../db/models')


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
            const {from,to,content } = data
            const chat_id = [from,to].sort().join("_")
            const create_time = Date.now()
            new ChatModel({chat_id,from,to,create_time,content}).save(function (error,chatMsg) {
                if(error){
                    console.log(error)
                }else{
                    //向所有连接的用户发消息
                    io.emit('receiveMsg',chatMsg)
                    // socket.emit('receiveMsg',chatMsg);
                }
            })

        })

    })
}


