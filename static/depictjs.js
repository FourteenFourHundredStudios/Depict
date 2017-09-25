

attachments=[];
components=[];

componentObjs=[];


depict={
    attach:function(el){
        attachments.push({name:el,html:$(el).html()});
    },
    event:function(obj,eventName){
        $.post("/depict/event",{"componentId":$(obj).parent().attr("depictId"),"eventName":eventName},function(results){
            
        });
    }
}




 $.post("/depict/start",{},function(results){
    components=results;
    attachments.forEach(function(el){
        components.forEach(function(component){
            $(el.name).find(component.name).each(function() {
                newComponent=JSON.parse(JSON.stringify(component));
                id=(Math.random()+"").replace(".","");
                newComponent.id=id;
                $(this).attr("depictId",id);
                componentObjs.push(newComponent);
                
            });
        });
    });


    $.post("/depict/loadComponents",{componentList:componentObjs},function(results){
        renderDepict();
        longPoll();
        callEventsAll("onDepict"); 
    });
    

});


function callEventsAll(event){
    var count=0;
    function onDepict(){
        $.post("/depict/event",{"componentId":componentObjs[count].id,"eventName":componentObjs[count].name+"."+event},function(results){
            if(count>=componentObjs.length){
                return;
            }
            onDepict();
            count++;
        });
    }
    onDepict();
}

function longPoll(){
    $.post("/depict",{},function(results){
        handleDepiction(results);
        longPoll();
    });
}

function handleDepiction(results){
    for(var i=0;i<componentObjs.length;i++){
        component=componentObjs[i];
        
        if(component.id==results.id){
            component.attribute[results.attribute]=results.value;
            renderDepict();
        }
    }
}


function depictParse(component){
    var text = $(component.model).html();
    vars=text.match(/{{(.*?)}}/g);
    
    for(var i=0;i<vars.length;i++){
        el=vars[i];
        pEl=el.substring(2,el.length-2);
        text=text.replace(el,component.attribute[pEl]);
    }
    return $(component.model).html(text);
}

function renderDepict(){
    attachments.forEach(function(el){
        componentObjs.forEach(function(component){
       

            $(el.name).find("[depictId="+component.id+"]").html(depictParse(component));
            



        });
    });
}