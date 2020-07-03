

const { ChatModel,SocketModel,UserModel } = require('../db/models')




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


                    SocketModel.findOne({userid:to},(error,userOne) => {
                        if(error){
                            console.log("向指定的id发送消息时，查找id错误")
                            io.emit('receiveMsg',chatMsg) //向全部的在线用户发送消息
                        }else if(userOne){
                            console.log(userOne)
                            //向指定的用户发消息
                            io.to(userOne.socketid).emit('receiveMsg',chatMsg);
                            //给当前连接用户也发送一条
                            socket.emit('receiveMsg',chatMsg)

                        }else {
                            console.log("用户不在线")
                            socket.emit('receiveMsg',chatMsg)
                        }


                    })
                    // socket.emit('receiveMsg',chatMsg);
                }
            })

        })
        socket.on('sendUser',(data) =>{
            SocketModel.findOne({userid:data.userid},function (error,socketData) {
                if(error){
                    console.log("查找失败.")
                }else{
                    if(socketData){
                        SocketModel.update({userid:data.userid},{socketid:socket.id},function (error,suc) {
                            // console.log('更新用户socketid',suc)
                        })
                    }else {
                        new SocketModel({socketid:socket.id,userid:data.userid}).save((err,soc)=>{
                            if(err){
                                console.log("保存失败")
                            }else {
                                console.log("保存成功")
                            }
                        })
                    }
                }
            })

            UserModel.findOne({_id:data.userid},function (error,userdata) {
                if(error){
                    console.log(error)
                }else{
                    try{
                        console.log(userdata.username+ '----'+ userdata.type + '上线了')
                    }catch (e) {

                    }
                }
            })
        })
    })
}


