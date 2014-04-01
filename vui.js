(function($) {
  //template variables 
  var genLI='<li id="@prefix@@value@" class="ui-widget-content ui-corner-all"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span><span title="@label@">@value@</span><span class="ui-icon ui-icon-close" title="Remove item"></span></li>',
      container='<div class="vui vui-multiselect"><ul class="ui-widget"></ul><button>@button@</button></div>';

    
    $.fn.visioMultiselect=function(options){
        
        var settings = $.extend({
            // These are the defaults options
            duration: 2000,
            eventID:"vbroadcast",
            prefix:"vui_multi_li_",
            effect: "highlight",
            button:"Run stuff",
            buttonIcon:"ui-icon-circle-check",
            action:function(list){
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
                  var newli=genLI.replace(/@prefix@/g,settings.prefix).replace(/@value@/g,e.message.value).replace(/@label@/g,e.message.label);
                  $(newli).appendTo(self.find("ul").first()).effect(settings.effect, {}, settings.duration).hover(function() {
                          $( this ).toggleClass( "ui-state-hover" );
                      }).tooltip().find('.ui-icon-close').click(function(){
                      
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
