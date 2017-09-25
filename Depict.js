
components=[];
componentList=[];

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

                for(var i=0;i<componentList.length;i++){
                    if(componentList[i].id===component.id){
                        componentList[i].attach[key]=v;
                        break;
                    }
                }
             
                eventEmitter.emit('depiction',{component:component.name,id:component.id,attachment:key,value:v});
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

     app.post("/depict/loadComponents",function(req,res){
         componentList=req.body.componentList

      
         res.send("ok");
     });

     app.post("/depict/event",function(req,res){
         componentName=req.body.eventName.split(".")[0];
         componentEvent=req.body.eventName.split(".")[1];

         /*
         for(var i=0;i<components.length;i++){
             if(components[i].name==componentName){
                 components[i]["events"][componentEvent](getDepictParam(components[i]));
             }
         }*/

         console.log(componentList);

         for(var i=0;i<componentList.length;i++){
             console.log("id",componentList[i].id);
             if(componentList[i].id===req.body.componentId){
                //console.log(componentList[i]);

                 for(var j=0;j<components.length;j++){
                    if(components[j].name==componentName){
                        componentList[i]["events"]=components[j]["events"];
                        //console.log(components[i]["events"]);
                        break;
                    }
                }

                 componentList[i]["events"][componentEvent](getDepictParam(componentList[i]));
                 break;
                 //console.log(componentList[i]["events"][componentEvent]);

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







    
