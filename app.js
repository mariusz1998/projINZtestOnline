var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver');
var app = express();

//view engine 

app.set('views',path.join(__dirname, 'views')); //tutaj jakie są widoki
app.set('view engine','ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/public1", express.static(__dirname + "/public1"));

app.use("/public2", express.static(__dirname + "/public2"));

var driver = neo4j.driver('bolt://54.237.207.193:32954', neo4j.auth.basic('neo4j','toe-employees-interests'));

var session = driver.session();

//app.use zobacz
app.get('/', function (req,res){
    res.render('mainMenu');
});
app.get('/registration', function(req,res){ 
res.render('registration');
});
//app.get('/login', function(req,res){ 
//res.render('login');
//});

var session123 = driver.session();
app.post('/registration/add',function(req,res){
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
       var login = req.body.login;
       var password = req.body.password;
       var email = req.body.email;
    session123            
            .run('CREATE(n:User {firstName:$firstNameParam,lastName:$lastNameParam,login:$loginParam,password:$passwordParam,email:$emailParam}) RETURN n.login',
  {firstNameParam:firstName,lastNameParam:lastName,loginParam:login,passwordParam:password,emailParam:email})
            .then(function(result){    
                  res.redirect('/registration');
                    // session123.close();
    })
            .catch(function(err){
                console.log(err);
    });
 //  res.redirect('/');// wysyła do początkowej stronny
});
app.get('/user/login/count', function(req,res){ 
session
        .run('MATCH(n:Person) RETURN n LIMIT 50')
        .then(function(result2){
            var actorArr= [];
            result2.records.forEach(function(record){
                actorArr.push({
                    id: record._fields[0].identity.low,
                    name: record._fields[0].properties.name
                });
            });
res.render('aktorzy',{actors: actorArr});
        })
                .catch(function(err){
           console.log();         
        });
});


app.get('/login', function(req,res){ 
session
        .run('MATCH(n:User) RETURN n.login ')
        .then(function(result2){
            var userArr= [];
            result2.records.forEach(function(record){
                userArr.push({
                    login: record._fields[0].properties.login,
                    password: record._fields[0].properties.password
                });
            });
res.render('login',{users:userArr});
        })
                .catch(function(err){
           console.log(err);         
        });
});
app.post('/movie/add',function(req,res){
    var name = req.body.movie_name;
    var year = req.body.movie_year;
    session123                  //dajesz kolejne atrybuty po przecinku w tym nawiasie {}
            .run('CREATE(n:Movie {title:$titleParam,year:$yearParam}) RETURN n.title',
  {titleParam:name,yearParam:year})
       // .run('MATCH (n:Movie {title:"Star Wars Sand"})DELETE n')
            .then(function(result){    
                  res.redirect('/');
                    // session123.close();
       
    })
            .catch(function(err){
                console.log(err);
    });
 //  res.redirect('/');// wysyła do początkowej stronny
});
app.post('/movie/delete',function(req,res){
    session123
        .run('MATCH (n:Movie {title:"Star Wars Sand"})DELETE n')
            .then(function(result){
                  res.redirect('/'); 
       // session123.close();
    })
            .catch(function(err){
                console.log(err);
    });
  // res.redirect('/');// wysyła do początkowej stronny
});
app.post('/movie/actor/add',function(req,res){
    var name = req.body.name; //do aktora
    var title = req.body.title;
    session123
            .run('MATCH(a:Person{name:$nameParam}),(b:Movie{title:$titleParam}) MERGE(a)-[r:ACTED_IN {year:2012}]-(b) RETURN a,b'
            ,{titleParam: title, nameParam:name})
            //dodało year 2012
                    .then(function(result){
                        res.redirect('/aktorzy');
            })
                    .catch(function(err){
                        console.log(err);          
            });
});
app.listen(3000);
console.log('Server Started on Port 3000');

module.exports = app;