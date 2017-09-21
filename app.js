


//require('../../Settings.js');


express = require('express');
http = require('http');
app = express();
bodyParser = require('body-parser');
depict = require('./depict.js');

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())


app.use(depict.route(app));

app.use('/', express.static('static'));


app.get("/",function(req,res){
    res.sendfile("index.html");

    req.depict.attach({
        "greeting":"hello world!"
    });

    setTimeout(function(){
        req.depict.greeting="Random Number "+Math.random();
    },2000);

});

server=http.createServer(app);

server.listen(8000,'localhost',function(){
    console.log('Depict Server started!')
});



depict.component({
    template:"file.html",
    attach:{
        "greeting":"hello world!"
    },
    route:function(req,res){
        req.depict.greeting="Random Number "+Math.random();
    }
});