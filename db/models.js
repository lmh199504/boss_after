/*
* 包含多个操作数据库集合的Model 模块
* */

const mongoose = require('mongoose')


mongoose.connect('mongodb://localhost:27017/boss',{ useNewUrlParser: true,useUnifiedTopology: true })

const conn = mongoose.connection

conn.on("connected",() => {
    console.log("数据库连接成功...")
})

//文档对象Schema
const userSchema = mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required: true},
    type:{type:String,required:true},
    header:{type:String},
    post:{type:String},  //职位
    info:{type:String}, //个人或职位简介
    company:{type:String}, //公司名称
    salary:{type:String} //月薪
})
//定义Model
const UserModel = mongoose.model('user',userSchema)


//向外暴露Model
exports.UserModel = UserModel