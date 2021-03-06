
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
    Object.keys(component.attribute).forEach(function(key,index) {
        var val=component.attribute[key];
        Object.defineProperty(params, key, {
            get: function() {
                return val;
            },
            set: function(v) {
                val=v;

                for(var i=0;i<componentList.length;i++){
                    if(componentList[i].id===component.id){
                        componentList[i].attribute[key]=v;
                        break;
                    }
                }
             
                eventEmitter.emit('depiction',{component:component.name,id:component.id,attribute:key,value:v});
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

         for(var i=0;i<componentList.length;i++){
             if(componentList[i].id===req.body.componentId){
                //console.log(componentList[i]);

                 for(var j=0;j<components.length;j++){
                    if(components[j].name==componentName){
                        componentList[i]["events"]=components[j]["events"];
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







    
