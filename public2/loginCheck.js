/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function checkLoginUsers(login){
    console.log("jestem w skrypcie");
    var neo4j = require('neo4j-driver');
var driver = neo4j.driver('bolt://54.237.207.193:32954', neo4j.auth.basic('neo4j', 'toe-employees-interests'));

            var session = driver.session();
        session
        .run('MATCH(n {login:$loginParam}) RETURN COUNT(n)',{loginParam:login})
        .then(function(result2){
            console.log(result2);
                });
//res.render('aktorzy',{actors: actorArr});
        
        //var JSONToSend = "{\"login\":\"" + document.getElementById("login").value + "\",";
        //    JSONToSend = JSONToSend + "\"password\":\"" + document.getElementById("password").value+"\"}";
        //    console.log(JSONToSend);
       }
