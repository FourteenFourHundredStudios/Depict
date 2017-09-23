
components=[];

var events = require('events');
var eventEmitter = new events.EventEmitter();

//idk if bodyParser should be utilized? it's another lib..., how does including this into the lib work?
bodyParser = require('body-parser');


function router(req,res,next){
    next();
}

function getDepictParam(component){
    params={};
    Object.keys(component.attach).forEach(function(key,index) {
        var val=component.attach[key];
        Object.defineProperty(params, key, {
            get: function() {
                return val;
            },
            set: function(v) {
                val=v;
                eventEmitter.emit('depiction',{component:component.name,attachment:key});
            }
        });
    });
    return params;
}

exports.component=function(component){
    components.push(component);

}

 exports.route=function(app,register){
 
     
    app.use(bodyParser.urlencoded());
    app.use(bodyParser.json());

     register();
     app.post("/depict/start",function(req,res){
         res.send(components);
     });
     app.post("/depict/event",function(req,res){
         componentName=req.body.eventName.split(".")[0];
         componentEvent=req.body.eventName.split(".")[1];

         for(var i=0;i<components.length;i++){
             if(components[i].name==componentName){
                 components[i]["events"][componentEvent](getDepictParam(components[i]));
             }
         }

         res.send("OK");
     });
     app.post("/depict",function(req,res){
         eventEmitter.once('depiction', function(val){
            res.send(val);
            res.end();
         });
     });
     return router;
 };







    
