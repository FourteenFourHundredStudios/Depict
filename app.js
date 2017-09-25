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
            <div onClick="depict.event(this,'card.changeMessage')">
                {{message}}
            </div>
        `,
        attach:{
            "messages":["look","at","these","object","changes!"],
            "count":0,
            "message":"start"
        },
        events:{
            onDepict:function(depict){
                depict.message="Changed with the 'onDepict' event!";
            },
            changeMessage:function(depict){
                depict.message=depict.messages[depict.count];
                depict.count++;
                if(depict.count>=depict.messages.length){
                    depict.count=0;
                }
            }
        }
    });

}));


server.listen(8000,'localhost',function(){
    console.log('Depict Server started!')
});

