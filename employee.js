// (2)路由器( routes )
const express=require('express');
//    引入连接池模块
const pool=require('../pool.js');
//    创建路由器对象
var router=express.Router();
//往路由器添加路由
//1.插入简历信息(插入数据)
router.post('/add',function(req,res){
	//获取数据
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
  pool.query('INSERT INTO zp_employee SET ?',[obj],function(err,result){
    if(err) throw err;
    if(result.affectedRows>0){
    res.send({code:200,msg:'add suc'});
    }
    });
    });


//3.删除信息
    router.get('/delete',function(req,res){
		if (!req.query)
		{
			res.send({code:401,msg:'eid required'});
				return;
		}
	pool.query('DELETE FROM zp_employee WHERE eid=?',[req.query.eid],function(err,result){
		if(err) throw err;
		if(result.affectedRows>0){
			res.send("1");
		}else{
     res.send({code:302,msg:'delete err'});
    }
	});
 })
	//4.检索信息（查询）
	router.get('/query',function(req,res){
		if(!req.query.eid){
		res.send({code:401,msg:'eid required'});
     return;
  }
  pool.query('SELECT * FROM zp_employee WHERE eid=?',[req.query.eid],function(err,result){
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
	var $eid=req.body.eid;
	var $ename=req.body.ename;
	var $esex=req.body.esex;
	var $ebirth=req.body.ebirth;
	var $etel=req.body.etel;
	var $eemail=req.body.eemail;
	var $eedu=req.body.eedu;
	var $eintro=req.body.eintro;
	var $ejob=req.body.ejob;
	var $esalary=req.body.esalary;
	if(!$eid){
		res.send("eid不存在");
		return;
	}
	if(!$ename){
		res.send("ename不存在");
		return;
	}
	if(!$esex){
		res.send("esex不存在");
		return;
	}
	if(!$ebirth){
		res.send("ebirth不存在");
		return;
	}
	if(!$etel){
		res.send("etel不存在");
		return;
	}
	if(!$eemail){
		res.send("eemail不存在");
		return;
	}
	
	if(!$eedu){
		res.send("eedu不存在");
		return;
	}
	if(!$eintro){
		res.send("eintro不存在");
		return;
	}
	if(!$ejob){
		res.send("ejob不存在");
		return;
	}
	if(!$esalary){
		res.send("esalary不存在");
		return;
	}
	
	//数据库操作
	var sql="update zp_employee set ename=?,esex=?,ebirth=?,etel=?,eemail=?,eedu=?,eintro=?,ejob=?,esalary=? where eid=?";
	pool.query(sql,[$ename,$esex,$ebirth,$etel,$eemail,$eedu,$eintro,$ejob,$esalary,$eid],(err,result)=>{
		if(err) throw err;
		res.send("1");
		//跳转回当前页面
		
	});
});

  //6.用户列表（查询）
  router.get('/employeelist',function(req,res){
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
  pool.query('SELECT * FROM zp_employee LIMIT ?,?',[start,count],function(err,result){
	  if(err) throw err;
      res.send(result);
  });                                                                      
  })
	
// 导出路由器
module.exports=router;