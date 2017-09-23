express = require('express');
http = require('http');
app = express();
depict = require('./depict.js');


app.use('/', express.static('static'));


server=http.createServer(app);

app.use(depict.route(app,function(){
    depict.component({
        name:"card",
        model:`
            <div>
                look at this number: {{number}}<br>
                <i>look at this other number: {{number2}}</i>
            </div>
        `,
        attach:{
            "number":Math.random(),
            "number2":Math.random()
        },
        events:{
            onDepict:function(depict){
                setInterval(function(){
                    depict.number=Math.random();
                },1000);
                setInterval(function(){
                    depict.number2=Math.random();
                },50);
            },
        }
    });
}));


server.listen(8000,'localhost',function(){
    console.log('Depict Server started!')
});

