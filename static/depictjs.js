

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

                //console.log( newComponent.id);

                $(this).attr("depictId",id);
                componentObjs.push(newComponent);
                
            });
        });
    });


    console.log(componentObjs);

    $.post("/depict/loadComponents",{componentList:componentObjs},function(results){

        

        renderDepict();
        longPoll();

        /*
        onDepic event 
        components.forEach(function(component){
            $.post("/depict/event",{"eventName":component.name+".onDepict"},function(results){
            });
        });*/

    });

});


function longPoll(){
    $.post("/depict",{},function(results){
        handleDepiction(results);
        longPoll();
    });
}

function handleDepiction(results){
    for(var i=0;i<componentObjs.length;i++){
        component=componentObjs[i];
        console.log(component);
        if(component.id==results.id){
            component.attach[results.attachment]=results.value;
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
        text=text.replace(el,component.attach[pEl]);
    }
    return $(component.model).html(text);
}

function renderDepict(){
    attachments.forEach(function(el){
        componentObjs.forEach(function(component){
       

            $(el.name).find("[depictId="+component.id+"]").html(depictParse(component));
            

            /*
            $(el.name).find(component.name).each(function() {
                console.log("here");
            });*/


        });
    });
    console.log(componentObjs);
}