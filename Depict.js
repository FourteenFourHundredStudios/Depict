
var events = require('events');
var eventEmitter = new events.EventEmitter();

function router(req,res,next){
    req.depict={};
    req.depict.attach=function(values){
        Object.keys(values).forEach(function(key,index) {
            var val=values[key];
            Object.defineProperty(req.depict, key, {
                get: function() {
                    return val;
                },
                set: function(v) {
                    val=v;
                    eventEmitter.emit('depiction',{"name":key,"value":v});
                }
            });
        });
    }
    next();
}



 exports.route=function(app){
     app.post("/depict/start",function(req,res){
         
     });
     app.post("/depict",function(req,res){
         eventEmitter.once('depiction', function(val){
            res.send(val);
            res.end();
         });
     });
     return router;
 };







    
