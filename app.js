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
            "message":"hello world!",
        },
        events:{
            changeMessage:function(depict){
                depict.message="goodbye world!";
            }
        }
    });

    



}));


server.listen(8000,'localhost',function(){
    console.log('Depict Server started!')
});

