(function($) {
  //template variables 
    var genLI='<li style="mmin-width:@width@" id="@prefix@@value@" class="ui-widget-content ui-corner-all"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span><span title="@value@ - @label@">@text@</span><span class="ui-icon ui-icon-close" title="@remove@"></span></li>',
        container='<div class="vui vui-multiselect"><ul class="ui-widget"></ul><button>@button@</button></div>';

    
    $.fn.visioMultiselect=function(options){
        
        var settings = $.extend({
            // These are the defaults options
            duration: 2000, //animation duration
            eventID:"vbroadcast", //event to listen
            prefix:"vui_multi_li_", //prefix of DOM IDs created
            effect: "highlight", //effect
            button:"Run stuff", //label
            buttonIcon:"ui-icon-circle-check",
            width:"120px", //in pixels, or "auto"
            text:"value",   //value | label   (item content display)     
            removeTitle:"Remove item",
            action:function(list){ //handler triggered when clicking run button
                alert("Run custom stuff with list of values: "+list.join(","));
            }
        }, options ),
            self=this,
            getValues=function(){
                //return values currently selected in an array, in the same order as jquery UI widget
                var values= self.find("ul").first().sortable("toArray"),
                    prefix=new RegExp("^"+settings.prefix); 
                 for(var i = 0, len = values.length; i < len; i++) {
                    values[i] = values[i].replace(prefix, '');
                }               
                return values;
            },
            addLine=function(e){
              //add a new line to the widget if the ID is not already present
              var newID="#"+settings.prefix+e.message.value.replace(/\./g,'\\.');
          
              if( !self.find(newID).length){
                  //ID does not exist, this is a new row
                  var m=e.message,
                      text=(settings.text=="value"?m.value:m.label),
                      title=m.label+"-"+m.value,
                      newli=genLI.replace(/@prefix@/g,settings.prefix)
                                 .replace(/@value@/g,m.value)
                                 .replace(/@label@/g,m.label)
                                 .replace(/@remove@/g,settings.removeTitle)
                                 .replace(/@text@/g,text)
                                 .replace(/@width@/g,settings.width);
                                 
                  $(newli).appendTo(self.find("ul").first()).effect(settings.effect, {}, settings.duration).find('.ui-icon-close').click(function(){
                      
                        $(newID).effect('fade', {}, 250, function(){
                                $(this).remove();
                                //button should be disabled if there is no entry left in the list
                                if( !self.find('li').length){
                                    self.find('button').button("disable");
                                }                               
                            })
                  });
                  self.find('button').button("enable");
                  self.find("ul").sortable();
              }else{
                  //this ID exists, we should just highlight it
                  self.find(newID).effect( settings.effect, {}, settings.duration);
              }
          }; 
        
        //initialize both container and buttons
        self.html(container).find('button').html(settings.button).click(function(){settings.action(getValues())}).button({disabled:true,icons:{ primary: settings.buttonIcon }});
        
        //event listener
        $(document).on(settings.eventID,function(event){
            //console.log(event);
            addLine(event);
        })      
    }
})((typeof(visiojQuery)=="undefined"?jQuery:visiojQuery))
