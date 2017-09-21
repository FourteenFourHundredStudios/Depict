


attachments=[];

$.post("/depict/start",{},function(results){
    handle(results);
    longPoll();
});


function longPoll(){
    $.post("/depict",{},function(results){
        handle(results);
        longPoll();
    });
}

function attach(name,obj){
    
}

function handle(results){
    if(!attachments.includes(results.name)){
         $( "[attach='"+results.name+"']" ).text(results.value);
    }else{
        
    }
   

}