



attachments=[];
components=[];


depict={
    attach:function(el){
        attachments.push({name:el,html:$(el).html()});
    },
    event:function(eventName){
        $.post("/depict/event",{"eventName":eventName},function(results){
            
        });
    }
}

 $.post("/depict/start",{},function(results){
     components=results;
     renderDepict();
     longPoll();
     components.forEach(function(component){
        $.post("/depict/event",{"eventName":component.name+".onDepict"},function(results){
        });
     });
});


function longPoll(){
    $.post("/depict",{},function(results){
        handleDepiction(results);
        longPoll();
    });
}

function handleDepiction(results){
    for(var i=0;i<components.length;i++){
        component=components[i];
        if(component.name==results.component){
            component.attach[results.attachment]=results.value;
            renderDepict();
        }
    }
}


function depictParse(component,html){
    var text = $(component.model).html();
    vars=text.match(/{{(.*?)}}/g);
    
    for(var i=0;i<vars.length;i++){
        el=vars[i];
        pEl=el.substring(2,el.length-2);
        text=text.replace(el,component.attach[pEl]);
    }
    return $(html).html(text);
}

function renderDepict(){
    attachments.forEach(function(el){
        components.forEach(function(component){
       
            //console.log(component.name);
            //$.post("/depict/event",{"eventName":component.name+".onDepict"},function(results){
            
       
                $(el.name).find(component.name).html(function() {
                    return depictParse(component,component.model);
                });

//            });

        });
    });
}