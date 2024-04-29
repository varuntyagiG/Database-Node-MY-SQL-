const mysql = require('mysql2');
const { faker } = require('@faker-js/faker');
const express = require("express");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
let port = 3000;

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'country',
    password : "Varu@2004"
  });

  let createRandomUser = ()=> {
    return [
      faker.string.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password(),
    ];
  }

  app.listen(port,()=>{
    console.log("req. listen along the port 3000");
  });
  
  app.get("/home",(req,res)=>{
    let q = "select count(*) from origin"; // jo vo count aa ye gha na vo ek array hogha...
    connection.query(q,(err,resu)=>{       // total number of user.
      let data = resu[0]["count(*)"];    // 104
      console.log(resu[0]["count(*)"]); 
      res.render("index.ejs",{data});
    })
  });

  app.get("/user",(req,res)=>{
    let q = "select * from origin";
    connection.query(q,(err,resu)=>{
      let data = resu;
      console.log(data);       // resu is the result of the query..
      res.render("user.ejs",{data});
    })
  });

  // edit route
app.get("/user/:id/edit",(req,res)=>{
  let {id} = req.params;
  let q = `select * from origin where id = '${id}'`;
  connection.query(q,(err,resu)=>{
   console.log(resu[0]);      // jo user ki information aaye ghe na vo bhi ekk array hi hoghe.
   let user = resu[0]; 
   res.render("edit.ejs",{user});
  })
});

app.patch("/user/:id",(req,res)=>{
  let {id} = req.params;
  let {password: formpass, username :newUsername} = req.body;
  let q = `select * from origin where id = '${id}'`;
  connection.query(q,(err,resu)=>{
    let user = resu[0];
    if( formpass != user.password){
      res.send("Wrong Password");
    }else{
      let q2 = `update origin set username = '${newUsername}' where id = '${id}'`;
      connection.query(q2,(err,result)=>{
        res.redirect("/user");
      });
    }
  });
});





  



