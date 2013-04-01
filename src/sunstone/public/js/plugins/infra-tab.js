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

var infra_tab_content =
'<table class="dashboard_table" id="infra_dashboard" style=>\
<tr>\
<td style="width:50%">\
<table style="width:100%">\
  <tr>\
    <td>\
      <div class="panel">\
<h3>' + tr("Summary of infrastructure resources") + '</h3>\
        <div class="panel_info">\
\
          <table class="info_table">\
            <tr class="cluster_related">\
              <td class="key_td">' + tr("Clusters") + '</td>\
              <td class="value_td"><span id="infra_total_clusters"></span></td>\
            </tr>\
            <tr>\
              <td class="key_td">' + tr("Hosts") + '</td>\
              <td class="value_td"><span id="infra_total_hosts"></span></td>\
            </tr>\
            <tr>\
              <td class="key_td">' + tr("Datastores") + '</td>\
              <td class="value_td"><span id="infra_total_datastores"></span></td>\
            </tr>\
            <tr>\
              <td class="key_td">' + tr("Virtual Networks") + '</td>\
              <td class="value_td"><span id="infra_total_vnets"></span></td>\
            </tr>\
          </table>\
\
        </div>\
      </div>\
    </td>\
  </tr>\
  <tr>\
    <td>\
      <div class="panel">\
        <h3>' + tr("Quickstart") + '</h3>\
        <div class="panel_info dashboard_p">\
             <ul>\
               <li><a class="action_button cluster_related" href="#clusters_tab" value="Cluster.create_dialog">'+tr("Create new Cluster")+'</a></li>\
               <li><a class="action_button" href="#hosts_tab" value="Host.create_dialog">'+tr("Create new Host")+'</a></li>\
               <li><a class="action_button" href="#datastores_tab" value="Datastore.create_dialog">'+tr("Create new Datastore")+'</a></li>\
               <li><a class="action_button" href="#vnets_tab" value="Network.create_dialog">'+tr("Create new Virtual Network")+'</a></li>\
             </ul>\
        </div>\
      </div>\
    </td>\
  </tr>\
</table>\
</td>\
<td style="width:50%">\
<table id="table_right" style="width:100%">\
  <tr>\
    <td>\
      <div class="panel">\
        <h3>' + tr("Infrastructure resources") + '</h3>\
        <div class="panel_info">\
            <p><img src="images/network_icon.png" style="float:right;" alt="network icon"/>'+tr("The Infrastructure menu allows management of Hosts, Datastores, Virtual Networks. Users in the oneadmin group can manage clusters as well.")+'</p>\
            <p>'+tr("You can find further information on the following links:")+'</p>\
            <ul>\
               <li><a href="http://opennebula.org/documentation:documentation:hostsubsystem" target="_blank">Host subsystem</a></li>\
               <li><a href="http://opennebula.org/documentation:documentation:host_guide" target="_blank">Managing Hosts</a></li>\
               <li><a href="http://opennebula.org/documentation:documentation:nm" target="_blank">Networking subsystem</a></li>\
               <li><a href="http://opennebula.org/documentation:documentation:cluster_guide" target="_blank">Managing Clusters</a></li>\
            </ul>\
        </div>\
      </div>\
    </td>\
  </tr>\
</table>\
</td>\
</tr></table>';

var infra_tab = {
    title: '<i class="icon-sitemap"></i>'+tr("Infrastructure"),
    content: infra_tab_content
}

Sunstone.addMainTab('infra_tab',infra_tab);

function updateInfraDashboard(what,json_info){
    var db = $('#infra_tab',main_tabs_context);
    switch (what){
    case "hosts":
        var total_hosts=json_info.length;
        $('#infra_total_hosts',db).html(total_hosts);
        break;
    case "vnets":
        var total_vnets=json_info.length;
        $('#infra_total_vnets',db).html(total_vnets);
        break;
    case "datastores":
        var total_datastores=json_info.length;
        $('#infra_total_datastores',db).html(total_datastores);
        break;
    case "clusters":
        var total_clusters=json_info.length;
        $('#infra_total_clusters',db).html(total_clusters);
        break;
    };
};

$(document).ready(function(){
    if (!mustBeAdmin())
        $('table#infra_dashboard .cluster_related', main_tabs_context).hide();
});