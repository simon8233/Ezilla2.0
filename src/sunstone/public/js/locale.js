/*-------------------------------------------------------------------------------*/
/* Copyright (C) 2013                                                            */
/*                                                                               */
/* This file is part of ezilla.                                                  */
/*                                                                               */
/* This program is free software: you can redistribute it and/or modify it       */
/* under the terms of the GNU General Public License as published by             */
/* the Free Software Foundation, either version 3 of the License, or             */
/* (at your option) any later version.                                           */
/*                                                                               */
/* This program is distributed in the hope that it will be useful, but WITHOUT   */
/* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS */
/* FOR A PARTICULAR PURPOSE. See the GNU General Public License                  */
/* for more details.                                                             */
/*                                                                               */
/* You should have received a copy of the GNU General Public License along with  */
/* this program. If not, see <http://www.gnu.org/licenses/>                      */
/*                                                                               */
/* Author: Chang-Hsing Wu <hsing _at_ nchc narl org tw>                          */
/*         Serena Yi-Lun Pan <serenapan _at_ nchc narl org tw>                   */
/*         Hsi-En Yu <yun _at_  nchc narl org tw>                                */
/*         Hui-Shan Chen  <chwhs _at_ nchc narl org tw>                          */
/*         Kuo-Yang Cheng  <kycheng _at_ nchc narl org tw>                       */
/*         CHI-MING Chen <jonchen _at_ nchc narl org tw>                         */
/*-------------------------------------------------------------------------------*/

var lang=""
var locale = {};
var datatable_lang = "";

function tr(str){
    var tmp = locale[str];
    if ( tmp == null || tmp == "" ) {
        //console.debug("Missing translation: "+str);
        tmp = str;
    }
    return tmp;
};

//Pops up loading new language dialog. Retrieves the user template, updates the LANG variable.
//Updates template and session configuration and reloads the view.
function setLang(lang_str){
    var lang_tmp="";
    var dialog = $('<div title="'+
                   tr("Changing language")+'">'+
                   tr("Loading new language... please wait")+
                   ' '+spinner+'</div>').dialog({
                       draggable:false,
                       modal:true,
                       resizable:false,
                       buttons:{},
                       width: 460,
                       minHeight: 50
                   });

    var updateUserTemplate = function(request,user_json){
        var template = user_json.USER.TEMPLATE;
        var template_str="";
        template["LANG"] = lang_tmp;

        //convert json to ONE template format - simple conversion
        $.each(template,function(key,value){
            template_str += (key + '=' + '"' + value + '"\n');
        });

        var obj = {
            data: {
                id: uid,
                extra_param: template_str
            },
            error: onError,
            success: function() {
                $.post('config',JSON.stringify({lang:lang_tmp}),function(){
                    window.location.href = ".";
                });
            }
        };
        OpenNebula.User.update(obj);

    };

    lang_tmp = lang_str;

    if (whichUI() == "sunstone"){
        var obj = {
            data : {
                id: uid
            },
            success: updateUserTemplate
        };
        OpenNebula.User.show(obj);
    } else {
        dialog.dialog('close');
    };
};

$(document).ready(function(){
    //Update static translations
    $('#doc_link').html(tr("Documentation"));
    $('#support_link').html(tr("Support"));
    $('#community_link').html(tr("Community"));
    $('#welcome').html(tr("Welcome"));
    $('#logout').html(tr("Sign out"));

    $("#lang_zh").text("台灣正體");
    $("#lang_en").text("English");

    if(lang=="zh_TW")
    $("#lang_zh").css({color:"#eee183", "font-weight":"bold", "font-size":"1.2em"});

    if(lang=="en_US")
    $("#lang_en").css({color:"#eee183", "font-weight":"bold", "font-size":"1.2em"});

    $("#lang_zh").click(function(){
    setLang('zh_TW');
   });

    $("#lang_en").click(function(){
    setLang('en_US');
   });

});
