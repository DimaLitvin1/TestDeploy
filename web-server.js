var fileSize = 1000000;
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var express = require('express');
var tedious = require('tedious');
var app  = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var port  = 8080;
var config =  {
    userName:"lightness",
    server :"linkdin.database.windows.net",
    password:"Amid1516",
    port: 1433,
    options: {
      encrypt: true, 
      database:'shopDb'
    }  
}

var connection = new Connection(config);
console.log(__dirname+'/view');
app.set('views',__dirname+'/view');
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(express.static(__dirname + "/view"));

app.post('/add/Items', function(req,res){
    var request = new Request(
        "INSERT INTO clients (name, surname, town, street) VALUES (@name,@surname,@town,@street)",
            function(err, rowCount, rows) {
                console.log(rowCount);
                
            }
        );
        request.addParameter("name", tedious.TYPES.Text, req.body.name);
        request.addParameter("surname", tedious.TYPES.Text, req.body.surname);
        request.addParameter("town", tedious.TYPES.Text,req.body.town);
        request.addParameter("street", tedious.TYPES.Text,req.body.street);
        connection.execSql(request);
});

app.get('/add',function(req,res){
  
    var self = this;
    self.tableRow = ``;
    
    var request = new Request(
        'SELECT * FROM clients',
        function(err, rowCount, rows) {
            console.log(rowCount + ' row(s) returned');
            console.log('rowCount2');
        }
    );
    
    request.on('row', function(columns) {
        self.tableRow += `<tr>`
        columns.forEach(function(column) {
            self.tableRow += `<td>${column.value}</td>`
        });
        self.tableRow += `</tr>`;
         
    });
    
    request.on('requestCompleted', function() {
        res.render('view/client',{data: self.tableRow});
    });
    
    connection.execSql(request);
});
app.listen(port);
