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
            <div onClick="depict.event('card.changeMessage')">
                This is the greeting: {{greeting}}
            </div>
        `,
        attach:{
            "greeting":"hello world!"
        },
        events:{
            changeMessage:function(depict){
                depict.greeting="goodbye";
            }
        }
    });
}));


server.listen(8000,'localhost',function(){
    console.log('Depict Server started!')
});

