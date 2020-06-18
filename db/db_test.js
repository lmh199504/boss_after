

const mongoose = require('mongoose')
const md5 = require('blueimp-md5') //MD5加密函数
mongoose.connect('mongodb://localhost:27017/boss_test',{ useNewUrlParser: true,useUnifiedTopology: true })

//1。连接数据库
mongoose.connection.on("connected",()=>{
    console.log("数据库连接成功")
})

//2.定义Schema（文档描述对象）
const userSchema = mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required: true},
    type:{type:String,required:true}
})

//2.2 定义Model（与集合对应，可以操作集合）
const UserModel = mongoose.model('user',userSchema)  //集合的名字为users

//3.通过Model或实例对集合数据进行CRUD操作

function testSave() {

   const userModel =  new UserModel({username: "Lmh",password: md5('770880'),type:'dashen'})
   userModel.save(function (error,userDoc) {
       if(error){
           console.log("保存失败了")
           return
       }
       console.log("保存成功了")
   })
}

function testFind() {
    UserModel.find(function (err,user) {
        console.log(err,user)
    })

    UserModel.findOne({username:'Tom'},function (err,user) {
        console.log(user)
    })
}


function testUpData() {
    UserModel.findByIdAndUpdate({_id:'5eea1ab9e895af370cda1717'},{username:"WZQ"},function (error,doc) {
        console.log(doc)
    })
}
// testUpData()
function testDelete() {
    UserModel.deleteOne({_id:'5eea1ab9e895af370cda1717'},function (err,data) {
        if(err){
            console.log(err)
            return
        }
        console.log(data)
    })
}
// testDelete()
testSave()