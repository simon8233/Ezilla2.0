/* -------------------------------------------------------------------------- */
/* Copyright 2002-2012, OpenNebula Project Leads (OpenNebula.org)             */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

var dashboard_tab_content =
'<table class="dashboard_table">\
<tr>\
<td>\
<table style="width:100%">\
  <tr>\
    <td>\
      <div class="panel">\
         <h3>' + tr("Hosts") + '<i class="icon-refresh action_button" value="Host.refresh" style="float:right;cursor:pointer"></i></h3>\
        <div class="panel_info">\
          <table class="info_table">\
\
            <tr>\
              <td class="key_td">' + tr("Total Hosts") + '</td>\
              <td class="key_td">' + tr("State") + '</td>\
            </tr>\
            <tr>\
              <td colspan="2"><div id="totalHosts" class="big_text" style="float:left;width:50%;padding-top:12px;"></div>\
                 <div id="statePie" style="float:right;width:50%;height:100px;"></div></td>\
            </tr>\
\
            <tr>\
              <td class="key_td">' + tr("Global CPU Usage") + '</td>\
              <td></td>\
            </tr>\
            <tr>\
              <td colspan="2"><div id="globalCpuUsage" style="width:100%;height:100px;"></div></td>\
            </tr>\
\
            <tr>\
              <td class="key_td">' + tr("Used vs. Max CPU") + '</td>\
              <td><div id="cpuUsageBar_legend"></div></td>\
            </tr>\
            <tr>\
              <td colspan="2">\
               <div id="cpuUsageBar" style="width:95%;height:50px"></div>\
              </td>\
           </tr>\
\
            <tr>\
              <td class="key_td">' + tr("Used vs. Max Memory") + '</td>\
              <td><div id="memoryUsageBar_legend"></div></td>\
            </tr>\
            <tr>\
              <td colspan="2">\
               <div id="memoryUsageBar" style="width:95%;height:50px"></div>\
              </td>\
            </tr>\
\
          </table>\
\
        </div>\
      </div>\
    </td>\
  </tr>\
  <tr>\
    <td>\
      <div class="panel">\
         <h3>' + tr("Clusters") + '<i class="icon-refresh action_button" value="Host.refresh" style="float:right;cursor:pointer"></i></h3>\
        <div class="panel_info">\
\
          <table class="info_table">\
\
            <tr>\
              <td class="key_td">' + tr("Allocated CPU per cluster") + '</td>\
              <td class="value_td"></td>\
            </tr>\
            <tr>\
              <td colspan="2"><div id="cpuPerCluster" style="width:100%;height:100px;overflow:hidden;"></div></td>\
            </tr>\
\
            <tr>\
              <td class="key_td">' + tr("Allocated Memory per cluster") + '</td>\
              <td class="value_td"></td>\
            </tr>\
            <tr>\
              <td colspan="2"><div id="memoryPerCluster" style="width:100%;height:100px;overflow:hidden;"></div></td>\
            </tr>\
\
          </table>\
\
        </div>\
      </div>\
    </td>\
  </tr>\
</table>\
</td>\
<td>\
<table style="width:100%">\
  <tr>\
    <td>\
      <div class="panel">\
        <h3>' + tr("Virtual Machines") + '<i class="icon-refresh action_button" value="VM.refresh" style="float:right;cursor:pointer"></i></h3>\
        <div class="panel_info">\
          <table class="info_table">\
\
            <tr>\
              <td class="key_td">' + tr("Total VMs") + '</td>\
              <td class="key_td">' + tr("State") + '</td>\
            </tr>\
\
            <tr>\
              <td colspan="2"><div id="totalVMs" class="big_text" style="float:left;width:50%;padding-top:12px;"></div>\
                  <div id="vmStatePie" style="float:right;width:50%;height:100px"></div></td>\
            </tr>\
\
            <tr>\
              <td class="key_td">' + tr("Bandwidth - Upload") + '</td>\
              <td class="key_td">' + tr("Bandwidth - Download") + '</td>\
            </tr>\
            <tr>\
              <td id="bandwidth_up" class="big_text"></td>\
              <td id="bandwidth_down" class="big_text"></td>\
            </tr>\
\
            <tr>\
              <td class="key_td">' + tr("Global transfer rates") + '</td>\
              <td colspan="2"><div id="netUsageBar_legend" style="float:right;"></div></td>\
            </tr>\
            <tr>\
              <td colspan="3">\
               <div id="netUsageBar" style="float:left;width:92%;height:50px"></div>\
              </td>\
            </tr>\
\
          </table>\
        </div>\
      </div>\
    </td>\
  </tr>\
  <tr>\
    <td>\
      <div class="panel">\
        <h3>' + tr("System Information") + '</h3>\
        <div class="panel_info">\
          <table class="info_table">\
\
            <tr>\
              <td class="key_td">' + tr("Total Users") + '</td>\
              <td class="key_td">' + tr("Total Groups") + '</td>\
            </tr>\
\
            <tr>\
              <td class="big_text" id="totalUsers"></td>\
              <td class="big_text" id="totalGroups"></td>\
            </tr>\
\
            <tr>\
              <td class="key_td">' + tr("Users per group") + '</td>\
              <td class="value_td"><i class="icon-refresh action_button" value="User.refresh" style="float:right;cursor:pointer"></i></td>\
            </tr>\
            <tr>\
              <td colspan="2"><div id="usersPerGroup" style="width:100%;height:100px;overflow:hidden;"></div></td>\
            </tr>\
\
          </table>\
        </div>\
      </div>\
    </td>\
  </tr>\
</table>\
</td>\
</tr></table>';

var dashboard_tab = {
    title: '<i class="icon-dashboard"></i>'+tr("Dashboard"),
    content: dashboard_tab_content,
    showOnTopMenu: false
}

Sunstone.addMainTab('dashboard_tab',dashboard_tab);

var $dashboard;

// All monitoring calls and config are called from the Sunstone plugins.

function dashboardQuotasHTML(){}

$(document).ready(function(){
        $dashboard = $('#dashboard_tab', main_tabs_context);
});
