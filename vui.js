(function($) {
    
  var genLI='<li id="@prefix@@value@" class="ui-widget-content ui-corner-all"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span><span title="@label@">@value@</span><span class="ui-icon ui-icon-close" title="Remove item"></span></li>',
      container='<div class="vui vui-multiselect"><ul class="ui-widget"></ul><button>@button@</button></div>',
      button='<button>Run stuff</button>';

    
    $.fn.visioMultiselect=function(options){
        
        var settings = $.extend({
            // These are the defaults.
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
                var values= self.find("ul").first().sortable("toArray"),
                    prefix=new RegExp("^"+settings.prefix); 
                 for(var i = 0, len = values.length; i < len; i++) {
                    values[i] = values[i].replace(prefix, '');
                }               
                return values;
            },
            addLine=function(e){
    
              var newID="#"+settings.prefix+e.message.value.replace(/\./g,'\\.');
          
              if( !self.find(newID).length){
                  //this is a new row
                  var newli=genLI.replace(/@prefix@/g,settings.prefix).replace(/@value@/g,e.message.value).replace(/@label@/g,e.message.label);
                  $(newli).appendTo(self.find("ul").first()).effect(settings.effect, {}, settings.duration).hover(function() {
                          $( this ).toggleClass( "ui-state-hover" );
                      }).find('.ui-icon-close').click(function(){
                      
                        $(newID).effect('fade', {}, 250, function(){
                                $(this).remove();
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
        
        self.html(container).find('button').html(settings.button).click(function(){settings.action(getValues())}).button({disabled:true,icons:{ primary: settings.buttonIcon }});
        
        $(document).on(settings.eventID,function(event){
            //console.log(event);
            addLine(event);
        })      
    }
})(visiojQuery)
