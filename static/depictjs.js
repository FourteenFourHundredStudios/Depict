



attachments=[];
components=[];


depict={
    attach:function(el){
        attachments.push(el);
    },
    event:function(eventName){
        $.post("/depict/event",{"eventName":eventName},function(results){
            
        });
    }
}

 $.post("/depict/start",{},function(results){
     components=results;
     initDepict();
     longPoll();
});


function longPoll(){
    $.post("/depict",{},function(results){
        handleDepiction(results);
        longPoll();
    });
}

function handleDepiction(results){
    console.log(results);
}


function depictParse(component,html){
    var text = $(html).text();
    vars=text.match(/{{(.*?)}}/g);   
    for(var i=0;i<vars.length;i++){
        el=vars[i];
        pEl=el.substring(2,el.length-2);
        text=text.replace(el,component.attach[pEl]);
    }
    return $(html).text(text);
}

function initDepict(){
    attachments.forEach(function(el){
        components.forEach(function(component){
            $(el).find(component.name).replaceWith(function() {
                return depictParse(component,component.model);
            });
        });
    });
}