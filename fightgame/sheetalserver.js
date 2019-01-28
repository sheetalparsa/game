var express = require('express');
var app = express();
var port = 3000;
const sqlite3 = require('sqlite3').verbose();
const util = require('util');
let db = new sqlite3.Database('sqlite.db');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get('/createhero',function(req,res){
  let randomuser = Math.floor(Math.random()*10000) + 10000;
  //store this randomuser as alive and win_score = 0;
  console.log("you are creating a new hero!!")
  console.log("New Hero : " + String(randomuser))

  db.serialize(function() {
    sql = "INSERT INTO HERO VALUES (" + randomuser + ", 1, 0)" 
    db.run(sql)

    sql = "SELECT * FROM HERO"
    db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
      console.log(rows)
    });
  });
  res.send({hero:randomuser});
})

app.get('/fighttodeath',function(req,res){
  //query database for at least two alive heroes;
  console.log("-----------------Fight To Death------------------")
  //found = true;
  heroes = [100,99]



  /*
  db.serialize(function() {
    sql = "SELECT * FROM HERO"
    db.all(sql, [], (err, rows) => {
      console.log(rows)
    });
  });  
  */
  db.serialize(function() {
    sql = "SELECT * FROM HERO WHERE STATE = 1 ORDER BY RANDOM()"
    db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
      //console.log(rows)
      console.log("-----------------")
      if(rows.length < 2) {
        res.send({status:false})
      } else {
        heroes[0] = rows[0].ID
        heroes[1] = rows[1].ID
        console.log(heroes)
        if (rows[0].WIN_SCORE > rows[1].WIN_SCORE) {
          alivehero = heroes[0]
          deadhero = heroes[1]
        } else {
          randindex = Math.floor(Math.random()*2);
          if (randindex == 0) {
            deadhero = heroes[0]
            alivehero = heroes[1]
          } else {
            deadhero = heroes[1]
            alivehero = heroes[0]
          }
        }
        //write in database that deadhero is dead in place of alive
        //console.log(deadhero)
        sql = "UPDATE HERO SET STATE = 0 WHERE ID = " + deadhero;
        db.run(sql)
        //increase alive hero's win_score
        sql = "UPDATE HERO SET WIN_SCORE = WIN_SCORE + 1 WHERE ID = " + alivehero
        db.run(sql)
        console.log("Dead : " + String(deadhero))
        console.log("Alive : " + String(alivehero))
        //this sends to user which hero won the fight
        res.send({status:true,fightBetween:heroes,alive:alivehero});
      }
    });

    sql = "SELECT * FROM HERO"
    db.all(sql, [], (err, rows) => {
      console.log(rows)
    });
  });

})

app.get("/champion", function(req,res){
  console.log("---------------We have a champion----------------")
  db.serialize(function() {
    sql = "SELECT ID FROM HERO WHERE WIN_SCORE=(SELECT MAX(WIN_SCORE) FROM HERO) LIMIT 1"
    db.all(sql, [], (err, rows) => {
      if (rows.length < 1) {
        console.log("No one is champion")
        res.send({champion:0})
      } else{
        hero = rows[0].ID
        console.log("Champion : " + String(hero))
        res.send({champion:hero})
      }
    });
  });
})

var server = app.listen(port,function(req,res){
  console.log("server started on "+ port);
});
