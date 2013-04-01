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

var vres_tab_content = '\
<table class="dashboard_table" style=>\
<tr>\
<td style="width:50%">\
<table style="width:100%">\
  <tr>\
    <td>\
      <div class="panel">\
<h3>' + tr("Summary of virtual resources") + '</h3>\
        <div class="panel_info">\
\
          <table class="info_table">\
<!--           \
            <tr>\
              <td class="key_td">' + tr("VM Templates") + '</td>\
              <td class="value_td"><span id="vres_total_templates"></span></td>\
            </tr>\
-->            \
            <tr>\
              <td class="key_td">' +
    tr("VM Instances")+ ' (' + 
    tr("total") + '/<span class="green">' +
    tr("running") + '</span>/<span class="red">' + 
    tr("failed") + '</span>)</td>\
              <td class="value_td"><span id="vres_total_vms"></span><span id="vres_running_vms" class="green"></span><span id="vres_failed_vms" class="red"></span></td>\
            </tr>\
<!--\
            <tr>\
              <td class="key_td">' + tr("Virtual Networks") + '</td>\
              <td class="value_td"><span id="vres_total_vnets"></span></td>\
            </tr>-->\
<!--           \
            <tr>\
              <td class="key_td">' + tr("Images") + '</td>\
              <td class="value_td"><span id="vres_total_images"></span></td>\
            </tr>\
-->            \
          </table>\
\
        </div>\
      </div>\
    </td>\
  </tr>\
<!--     \
<tr> \
    <td>\
	 <div class="panel">\
        <h3>' + tr("Quickstart") + '</h3>\
        <div class="panel_info dashboard_p">\
             <ul>\
                <li><a class="action_button" href="#vms_tab" value="VM.create_dialog">'+tr("Create new Virtual Machine")+'</a></li>\
                <li><a class="action_button" href="#templates_tab" value="Template.create_dialog">'+tr("Create new VM Template")+'</a></li>\
                <li><a class="action_button" href="#images_tab" value="Image.create_dialog">'+tr("Create new Image")+'</a></li>\
             </ul>\
        </div>\
      </div>\
    </td>\
  </tr>\
--> \
</table>\
</td>\
<td style="width:50%">\
<table id="table_right" style="width:100%">\
  <tr>\
    <td>\
      <div class="panel">\
        <h3>' + tr("Virtual Resources") + '</h3>\
        <div class="panel_info">\
            <p><img src="images/server_icon.png" alt="server" width="128" height="128" style="float:right;" />'+tr("The Virtual Resources menu allows management of Virtual Machine Templates, Instances and storage (Images).")+'</p>\
            <p>'+tr("Virtual Machine templates can be instantiated as many times as you want. You can do it from the Templates tab or by creating a new VM in the VM tab. The second method allows you to customize the name and the number of VMs you want to launch.")+'</p>\
            <p>'+tr("You can find further information on the following links:")+'</p>\
            <ul>\
               <li><a href="http://opennebula.org/documentation:documentation:vm_guide" target="_blank">Creating Virtual Machines</a></li>\
               <li><a href="http://opennebula.org/documentation:documentation:vm_guide_2" target="_blank">Managing Virtual Machines</a></li>\
               <li><a href="http://opennebula.org/documentation:documentation:img_guide" target="_blank">Managing Virtual Machine Images</a></li>\
            </ul>\
        </div>\
      </div>\
    </td>\
  </tr>\
</table>\
</td>\
</tr></table>';

var vres_tab = {
    title: '<i class="icon-cloud"></i>'+tr("Virtual Resources"),
    content: vres_tab_content
}

Sunstone.addMainTab('vres_tab',vres_tab);

function updateVResDashboard(what,json_info){
    var db = $('#vres_tab',main_tabs_context);
    switch (what){
    case "vms":
        var total_vms=json_info.length;
        var running_vms=0;
            failed_vms=0;
        $.each(json_info,function(){
            vm_state = parseInt(this.VM.STATE);
            if (vm_state == 3){
                running_vms++;
            }
            else if (vm_state == 7) {
                failed_vms++;
            }
        });
        $('#vres_total_vms',db).html(total_vms+'&nbsp;/&nbsp;');
        $('#vres_running_vms',db).html(running_vms+'&nbsp;/&nbsp;');
        $('#vres_failed_vms',db).html(failed_vms);
        break;
    case "vnets":
        var total_vnets=json_info.length;
        $('#vres_total_vnets',db).html(total_vnets);
        break;
    case "images":
        var total_images=json_info.length;
        $('#vres_total_images',db).html(total_images);
        break;
    case "templates":
        var total_templates=json_info.length;
        $('#vres_total_templates',db).html(total_templates);
        break;
    };
};

$(document).ready(function(){

});
