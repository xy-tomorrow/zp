// 路由器( routes )
const express=require('express');
//    引入连接池模块
const pool=require('../pool.js');
//    创建路由器对象
var router=express.Router();
//往路由器添加路由

//1.新增职位(插入数据)
router.post('/add',function(req,res){
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
  pool.query('INSERT INTO zp_job SET ?',[obj],function(err,result){
    if(err) throw err;
    if(result.affectedRows>0){
    res.send({code:200,msg:'add suc'});
    }
    });
    });

//3.删除职位
    router.get('/delete',function(req,res){
		if (!req.query)
		{
			res.send({code:401,msg:'jid required'});
				return;
		}
	pool.query('DELETE FROM zp_job WHERE jid=?',[req.query.jid],function(err,result){
		if(err) throw err;
		if(result.affectedRows>0){
			res.send("1");
		}else{
     res.send({code:302,msg:'delete err'});
    }
	});
 })
	//4.检索职位（查询）
	router.get('/query',function(req,res){
		if(!req.query.jid){
		res.send({code:401,msg:'jid required'});
     return;
  }
  pool.query('SELECT * FROM zp_job WHERE jid=?',[req.query.jid],function(err,result){
  if(err) throw err;
   if(result.length>0){
			res.send(result[0]);
		}else{
			res.send("没有查到用户信息");
		}
  });
 })


//5.职位修改(更改)
router.post("/update",(req,res)=>{
	//接收数据
	var $jid=req.body.jid;
	var $jname=req.body.jname;
	var $jadr=req.body.jadr;
	var $jsalary=req.body.jsalary;
	var $job=req.body.job;
	var $jrequ=req.body.jrequ;
	var $jphone=req.body.jphone;					
	if(!$jid){
		res.send("jid不存在");
		return;
	}
	
	if(!$jname){
		res.send("jname不存在");
		return;
	}
	if(!$jadr){
		res.send("jadr不存在");
		return;
	}
	if(!$jsalary){
		res.send("jsalary不存在");
		return;
	}
	if(!$job){
		res.send("job不存在");
		return;
	}
	if(!$jrequ){
		res.send("jrequ不存在");
		return;
	}
	if(!$jphone){
		res.send("jphone不存在");
		return;
	}
	//数据库操作
	var sql='update zp_job set jname=?,jadr=?,job=?,jsalary=?,jrequ=?,jphone=? where jid=?';
	pool.query(sql,[$jname,$jadr,$job,$jsalary,$jrequ,$jphone,$jid],(err,result)=>{
		if(err) throw err;
		res.send("1");
		//跳转回当前页面
		
	});
});

  //6.职位列表（查询）
  router.get('/joblist',function(req,res){
   //获取数据  
   //console.log(req.query);
   //如果页码是空，设置默认值
   var pno=req.query.pno;//页码
   var count=req.query.count;//数量
   //如果页码是空，设置默认值1
   if(!pno) pno=1;
   //如果数量为空，设置默认值2
   if(!count) count=5;
   //将数据转为整型
   pno=parseInt(pno);
   count=parseInt(count);
   //console.log(pno,count)
   //根据页码和数量计算开始查询的值
   //（页码-1）*数量
   var start=(pno-1)*count;
   //执行SQL语句
  pool.query('SELECT * FROM zp_job LIMIT ?,?',[start,count],function(err,result){
	  if(err) throw err;
      res.send(result);
  });                                                                      
  })
	
// 导出路由器
module.exports=router;