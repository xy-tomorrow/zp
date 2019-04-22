// (2)路由器( routes )
const express=require('express');
//    引入连接池模块
const pool=require('../pool.js');
//    创建路由器对象
var router=express.Router();
//往路由器添加路由
//1.用户注册
//1.用户注册(插入数据)
router.post('/reg',function(req,res){
	//获取数据
	//console.log(req.body);
	//验证数据是否为空
	var obj=req.body;
	var num=400;
	for(var key in obj){
	if(!obj[key]){
		res.send({code:num,msg:key+' required'});
		return;
		} 
	 }
	//把数据插入到数据库
	//在路由中使用连接池
	//执行SQL语句
  pool.query('INSERT INTO zp_user SET ?',[obj],function(err,result){
    if(err) throw err;
    if(result.affectedRows>0){
    res.send({code:200,msg:'register suc'});
    }
    });
    });
//2.用户登录
router.post('/login',function(req,res){
	//验证数据是否为空
	if(!req.body.uname){
		res.send({code:401,msg:'uname required'});
		return;
		}
	if(!req.body.upwd){
		res.send({code:402,msg:'upwd required'});
		return;
		}
	//执行SQL语句
	//查询数据中是否含有用户名和密码相匹配的数据
	pool.query('SELECT * FROM zp_user WHERE uname=? AND upwd=?',[req.body.uname,req.body.upwd],function(err,result){
		if(err)  throw err;
		if (result.length>0)
		{
			res.send({code:200,msg:'login suc'});
		}else{
			res.send({code:301,msg:'login err'});
			}
	 });
     });

//3.删除用户
    router.get('/delete',function(req,res){
		if (!req.query)
		{
			res.send({code:401,msg:'uid required'});
				return;
		}
	pool.query('DELETE FROM zp_user WHERE uid=?',[req.query.uid],function(err,result){
		if(err) throw err;
		if(result.affectedRows>0){
			res.send("1");
		}else{
     res.send({code:302,msg:'delete err'});
    }
	});
 })
	//4.检索用户（查询）
	router.get('/query',function(req,res){
		if(!req.query.uid){
		res.send({code:401,msg:'uid required'});
     return;
  }
  pool.query('SELECT * FROM zp_user WHERE uid=?',[req.query.uid],function(err,result){
  if(err) throw err;
   if(result.length>0){
			res.send(result[0]);
		}else{
			res.send("没有查到用户信息");
		}
  });
 })


//5.用户修改(更改)
router.post("/update",(req,res)=>{
	//接收数据
	var $uid=req.body.uid;
	var $uname=req.body.uname;
	var $upwd=req.body.upwd;
	var $email=req.body.email;
	var $phone=req.body.phone;
	var $user_name=req.body.user_name;
	var $gender=req.body.gender;
	if(!$uid){
		res.send("uid不存在");
		return;
	}
	if(!$uname){
		res.send("uname不存在");
		return;
	}
	if(!$upwd){
		res.send("upwd不存在");
		return;
	}
	if(!$email){
		res.send("email不存在");
		return;
	}
	if(!$phone){
		res.send("phone不存在");
		return;
	}
	if(!$gender){
		res.send("gender不存在");
		return;
	}
	if(!$user_name){
		res.send("user_name不存在");
		return;
	}
	//数据库操作
	var sql="update zp_user set uname=?,upwd=?,email=?,phone=?,user_name=?,gender=? where uid=?";
	pool.query(sql,[$uname,$upwd,$email,$phone,$user_name,$gender,$uid],(err,result)=>{
		if(err) throw err;
		res.send("1");
		//跳转回当前页面
		
	});
});

  //6.用户列表（查询）
  router.get('/userlist',function(req,res){
   //获取数据  
   //console.log(req.query);
   //如果页码是空，设置默认值
   var pno=req.query.pno;//页码
   var count=req.query.count;//数量
   //如果页码是空，设置默认值1
   if(!pno) pno=1;
   //如果数量为空，设置默认值2
   if(!count) count=10;
   //将数据转为整型
   pno=parseInt(pno);
   count=parseInt(count);
   //console.log(pno,count)
   //根据页码和数量计算开始查询的值
   //（页码-1）*数量
   var start=(pno-1)*count;
   //执行SQL语句
  pool.query('SELECT * FROM zp_user LIMIT ?,?',[start,count],function(err,result){
	  if(err) throw err;
      res.send(result);
  });                                                                      
  })
	
// 导出路由器
module.exports=router;