
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

var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j','mariusz'));

var session = driver.session();

app.get('/', function (req,res){
    session
        .run('MATCH(n:Movie) RETURN n LIMIT 25')
        .then(function(result){
                var movieArr =[];
result.records.forEach(function(record){
    movieArr.push({
        id: record._fields[0].identity.low,
        title: record._fields[0].properties.title,
        year: record._fields[0].properties.year
    });
});
res.render('index',{movies: movieArr});
        })
        .catch(function(err){
            console.log(err);
        });

});
app.get('/aktorzy', function(req,res){ 
session
        .run('MATCH(n:Person) RETURN n LIMIT 25')
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


app.listen(3000);
console.log('Server Started on Port 3000');

module.exports = app;