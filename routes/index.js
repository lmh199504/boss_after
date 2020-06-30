var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5')
const {UserModel} = require('../db/models')

const filter = { password:0,__v:0 }  //指定过滤的属性

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.post('/register',function (req,res,next) {
  //获取请求参数
  const {username,password,type} = req.body
  console.log(username,password,type)
  if(username === '' || password === '' || type === ''){
    res.send({code:1,msg:"注册信息不正确."})
    // return
  }


  //判断是否存在，存在返回错误信息，如果不存在，保存
  UserModel.findOne({username},function (err,data) {
    if(err){
      res.send({code:1,msg:"注册失败"})
    }

    if(data){
      res.send({code:1,msg:"此用户已存在"})
    }else{
      new UserModel({password:md5(password),username,type}).save(function (error,saveData) {
        console.log(saveData)
        res.cookie('userid',saveData._id,{maxAge:1000*60*60*24})
        res.send({code:0,data:saveData})
      })
    }
  })
  //返回响应数据
})

router.post('/login',function (req,res,next) {
  const {username,password} = req.body
  if(username === ''){
    res.send({code:1,msg:'用户名不能为空'})
  }else if(password === ''){
    res.send({code:1,msg:'请输入密码'})
  }else {
    UserModel.findOne({username,password:md5(password)},filter,function (err,data) {
      console.log(data)
      if(err){
        res.send({code:1,msg:"用户不存在"})
      }else{
        if(data){
          res.cookie('userid',data._id,{maxAge:1000*60*60*24})
          res.send({code:0,data:data})
        }else{
          res.send({code:1,msg:"用户名或密码不正确."})
        }
      }
    })
  }
})

router.post('/updata',function (req,res,next) {
  //从请求cookie 中获取userid
  console.log(req.cookies)
  const userid = req.cookies.userid
  if(!userid){
    return res.send({code:1,msg:"请先登录."})
  }
  //存在userid，跟新数据库中对于id 的数据
  const user = req.body
  UserModel.findByIdAndUpdate({_id:userid},user,function (error,oldUser) {

    if(error){
      console.log('errpr')
      console.log(error)
      //通知浏览器删除userid 的cookie
      res.clearCookie('userid')
      res.send({code:1,msg:'请先登录。'})
    }else {
      console.log('success')
      console.log(oldUser)
      const { _id,username,type } = oldUser
      const data = Object.assign(user,{ _id,username,type })
      res.send({code:0,data})
    }
  })

})


router.get('/user',function (req,res,next) {
  const userid = req.cookies.userid
  if(!userid){
    return res.send({code:1,msg:'请先登陆.'})
  }
  //根据userid查询对应的user
  UserModel.findOne({_id:userid},filter,function (error,user) {
    if(error){
      return res.send({code:1,msg:'用户不存在'})
    }
    res.send({code:0,data:user})
  })
})

router.get('/userlist',function (req,res,next) {

  console.log(req.query)
  const { type } = req.query

  UserModel.find({type,header:{$exists: true}},filter,function (error,users) {
    if(error){
      return res.send({code:1,msg:'系统错误'})
    }
    res.send({code:0,data:users})

  })
})

router.post('*',function (req,res,next) {
  console.log(req,res)
})

module.exports = router;
