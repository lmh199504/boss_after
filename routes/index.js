var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5')
const {UserModel} = require('../db/models')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/register',function (req,res,next) {
  //获取请求参数
  const {username,password,type} = req.body
  //判断是否存在，存在返回错误信息，如果不存在，保存
  UserModel.findOne({username},function (err,data) {
    if(data){

      res.send({code:1,msg:"此用户以存在"})
    }else{
      new UserModel({password:md5(password),username,type}).save(function (error,saveData) {

        res.cookie('userid',saveData._id,{maxAge:1000*60*60*24})

        res.send({code:0,data:saveData})
      })
    }
  })
  //返回响应数据

})

module.exports = router;
