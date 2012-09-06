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

/*Virtual Machines tab plugin*/
var INCLUDE_URI = "vendor/noVNC/include/";
var VM_HISTORY_LENGTH = 40;
var image_select;
var owner_network="";
var vmname=""

function loadVNC(){
    var script = '<script src="vendor/noVNC/include/vnc.js"></script>';
    document.write(script);
}
loadVNC();

var vm_graphs = [
    { title : tr("CPU"),
      monitor_resources : "CPU",
      humanize_figures : false,
      history_length : VM_HISTORY_LENGTH
    },
    { title : tr("Memory"),
      monitor_resources : "MEMORY",
      humanize_figures : true,
      history_length : VM_HISTORY_LENGTH
    },
    { title : tr("Network transmission"),
      monitor_resources : "NET_TX",
      humanize_figures : true,
      convert_from_bytes : true,
      history_length : VM_HISTORY_LENGTH
    },
    { title : tr("Network reception"),
      monitor_resources : "NET_RX",
      humanize_figures : true,
      convert_from_bytes : true,
      history_length : VM_HISTORY_LENGTH
    }
];

//Permanent storage for last value of aggregated network usage
//Used to calculate bandwidth
var netUsage = {
    time : new Date().getTime(),
    up : 0,
    down : 0
}

var vms_tab_content = '\
<h2><i class="icon-cloud"></i> '+tr("Virtual Machines")+'</h2>\
<form id="virtualMachine_list" action="javascript:alert(\'js error!\');">\
  <div class="action_blocks">\
  </div>\
<table id="datatable_vmachines" class="display">\
  <thead>\
    <tr>\
      <th class="check"><input type="checkbox" class="check_all" value="">'+tr("All")+'</input></th>\
      <th>'+tr("Status")+'</th>\
      <th>'+tr("ID")+'</th>\
      <th>'+tr("Owner")+'</th>\
      <th>'+tr("Group")+'</th>\
      <th>'+tr("Name")+'</th>\
      <th>'+tr("CPU")+'</th>\
      <th>'+tr("Memory")+'</th>\
      <th>'+tr("OStype")+'</th>\
      <th>'+tr("Hostname")+'</th>\
      <th>'+tr("IPs")+'</th>\
      <th>'+tr("Start Time")+'</th>\
      <th>'+tr("VNC Access")+'</th>\
      <th>'+tr("Remote Access")+'</th>\
    </tr>\
  </thead>\
  <tbody id="tbodyvmachines">\
  </tbody>\
</table>\
<div class="legend_div">\
  <span>?</span>\
  <p class="legend_p">\
'+tr("CPU, Memory and Start time are hidden columns by default. You can get monitoring graphs by clicking on the desired VM and visiting the monitoring information tab.")+'\
  </p>\
  <p class="legend_p">\
'+tr("VNC console requires previous install of the noVNC addon. Check Sunstone documentation for more information.")+'\
  </p>\
  <p class="legend_p">\
'+tr("You can hotplug and detach existing disks from running VMs from the Disks & Hotplugging tab in the VM information dialog.")+'\
  </p>\
</div>\
</form>';

var create_vm_tmpl ='<form id="create_vm_form" action="">\
  <fieldset>\
        <div>\
           <div>\
             <label for="vm_name">'+tr("VM Name")+':</label>\
             <input type="text" name="vm_name" id="vm_name" />\
             <div class="tip">'+tr("Defaults to template name when emtpy")+'.</div>\
           </div>\
           <div>\
             <label for="template_id">'+tr("Select template")+':</label>\
             <select id="template_id">\
             </select>\
           </div>\
           <div>\
             <label for="user_passwd">'+tr("Password for VM")+':</label>\
             <input type="password" name="user_passwd" id="user_passwd" value="">\
           </div>\
           <div>\
             <label for="user_passwd_confirm">'+tr("Confirm password")+':</label>\
             <input type="password" name="user_passwd_confirm" id="user_passwd_confirm" value="">\
           </div>\
           <div>\
             <label for="vm_n_times">'+tr("Deploy # VMs")+':</label>\
             <input type="text" name="vm_n_times" id="vm_n_times" value="1">\
             <div class="tip">'+tr("You can use the wildcard &#37;. When creating several VMs, %i will be replaced with a different number starting from 0 in each of them")+'.</div>\
           </div>\
        </div>\
        </fieldset>\
        <fieldset>\
        <div class="form_buttons">\
           <button class="button" id="create_vm_proceed" value="VM.create">'+tr("Create")+'</button>\
           <button class="button" type="reset" value="reset">'+tr("Reset")+'</button>\
        </div>\
</fieldset>\
</form>';

var update_vm_tmpl =
   '<form action="javascript:alert(\'js error!\');">\
         <h3 style="margin-bottom:10px;">'+tr("Please, choose and modify the virtual machine you want to update")+':</h3>\
            <fieldset style="border-top:none;">\
                 <label for="vm_template_update_select">'+tr("Select a VM")+':</label>\
                 <select id="vm_template_update_select" name="vm_template_update_select"></select>\
                 <div class="clear"></div>\
                 <div>\
                   <table class="permissions_table" style="padding:0 10px;">\
                     <thead><tr>\
                         <td style="width:130px">'+tr("Permissions")+':</td>\
                         <td style="width:40px;text-align:center;">'+tr("Use")+'</td>\
                         <td style="width:40px;text-align:center;">'+tr("Manage")+'</td>\
                         <td style="width:40px;text-align:center;">'+tr("Admin")+'</td></tr></thead>\
                     <tr>\
                         <td>'+tr("Owner")+'</td>\
                         <td style="text-align:center"><input type="checkbox" name="vm_owner_u" class="owner_u" /></td>\
                         <td style="text-align:center"><input type="checkbox" name="vm_owner_m" class="owner_m" /></td>\
                         <td style="text-align:center"><input type="checkbox" name="vm_owner_a" class="owner_a" /></td>\
                     </tr>\
                     <tr>\
                         <td>'+tr("Group")+'</td>\
                         <td style="text-align:center"><input type="checkbox" name="vm_group_u" class="group_u" /></td>\
                         <td style="text-align:center"><input type="checkbox" name="vm_group_m" class="group_m" /></td>\
                         <td style="text-align:center"><input type="checkbox" name="vm_group_a" class="group_a" /></td>\
                     </tr>\
                     <tr>\
                         <td>'+tr("Other")+'</td>\
                         <td style="text-align:center"><input type="checkbox" name="vm_other_u" class="other_u" /></td>\
                         <td style="text-align:center"><input type="checkbox" name="vm_other_m" class="other_m" /></td>\
                         <td style="text-align:center"><input type="checkbox" name="vm_other_a" class="other_a" /></td>\
                     </tr>\
                   </table>\
                 </div>\
<!--                 <label for="vnet_template_update_textarea">'+tr("Template")+':</label>\
                 <div class="clear"></div>\
                 <textarea id="vnet_template_update_textarea" style="width:100%; height:14em;"></textarea>\
-->\
            </fieldset>\
            <fieldset>\
                 <div class="form_buttons">\
                    <button class="button" id="vm_template_update_button" value="VM.update_template">\
                       '+tr("Update")+'\
                    </button>\
                 </div>\
            </fieldset>\
</form>';

var vmachine_list_json = {};
var dataTable_vMachines;
var $create_vm_dialog;
var $vnc_dialog;
var $redir_dialog;
var rfb;

var vm_actions = {
    "VM.create" : {
        type: "custom",
        call: function(id,name) {
            Sunstone.runAction("VM.TemplateInstantiate",id,name);
            Sunstone.runAction("VM.list");
        },
        callback: addVMachineElement,
        error: onError
    },

    "VM.create_dialog" : {
        type: "custom",
        call: popUpCreateVMDialog
    },

    "VM.update_dialog" : {
        type: "custom",
        call: popUpVMTemplateUpdateDialog
    },

    "VM.list" : {
        type: "list",
        call: OpenNebula.VM.list,
        callback: updateVMachinesView,
        error: onError
    },

    "VM.show" : {
        type: "single",
        call: OpenNebula.VM.show,
        callback: updateVMachineElement,
        error: onError
    },

    "VM.showinfo" : {
        type: "single",
        call: OpenNebula.VM.show,
        callback: updateVMInfo,
        error: onError
    },

    "VM.refresh" : {
        type: "custom",
        call : function (){
            waitingNodes(dataTable_vMachines);
            Sunstone.runAction("VM.list");
        }
    },

    "VM.autorefresh" : {
        type: "custom",
        call : function() {
            OpenNebula.VM.list({timeout: true, success: updateVMachinesView,error: onError});
        }
    },

    "VM.deploy" : {
        type: "multiple",
        call: OpenNebula.VM.deploy,
        callback: vmShow,
        elements: vmElements,
        error: onError,
        notify: true
    },

    "VM.migrate" : {
        type: "multiple",
        call: OpenNebula.VM.migrate,
        callback: vmShow,
        elements: function() { return getSelectedNodes(dataTable_vMachines); },
        error: onError,
        notify: true
    },

    "VM.livemigrate" : {
        type: "multiple",
        call: OpenNebula.VM.livemigrate,
        callback: vmShow,
        elements: vmElements,
        error: onError,
        notify: true
    },

    "VM.hold" : {
        type: "multiple",
        call: OpenNebula.VM.hold,
        callback: vmShow,
        elements: vmElements,
        error: onError,
        notify: true
    },

    "VM.release" : {
        type: "multiple",
        call: OpenNebula.VM.release,
        callback: vmShow,
        elements: vmElements,
        error: onError,
        notify: true
    },

    "VM.suspend" : {
        type: "multiple",
        call: OpenNebula.VM.suspend,
        callback: vmShow,
        elements: vmElements,
        error: onError,
        notify: true
    },

    "VM.resume" : {
        type: "multiple",
        call: OpenNebula.VM.resume,
        callback: vmShow,
        elements: vmElements,
        error: onError,
        notify: true
    },

    "VM.stop" : {
        type: "multiple",
        call: OpenNebula.VM.stop,
        callback: vmShow,
        elements: vmElements,
        error: onError,
        notify: true
    },

    "VM.restart" : {
        type: "multiple",
        call: OpenNebula.VM.restart,
        callback: vmShow,
        elements: vmElements,
        error: onError,
        notify: true
    },

    "VM.reset" : {
        type: "multiple",
        call: OpenNebula.VM.reset,
        callback: vmShow,
        elements: vmElements,
        error: onError,
        notify: true
    },

    "VM.resubmit" : {
        type: "multiple",
        call: OpenNebula.VM.resubmit,
        callback: vmShow,
        elements: vmElements,
        error: onError,
        notify: true
    },

    "VM.reboot" : {
        type: "multiple",
        call: OpenNebula.VM.reboot,
        callback: vmShow,
        elements: vmElements,
        error: onError,
        notify: true
    },

    "VM.saveas" : {
        type: "single",
        call: OpenNebula.VM.saveas,
        callback: vmShow,
        error:onError,
        notify: true
    },

    "VM.shutdown" : {
        type: "multiple",
        call: OpenNebula.VM.shutdown,
        callback: vmShow,
        elements: vmElements,
        error: onError,
        notify: true
    },

    "VM.cancel" : {
        type: "multiple",
        call: OpenNebula.VM.cancel,
        callback: vmShow,
        elements: vmElements,
        error: onError,
        notify: true
    },

    "VM.delete" : {
        type: "multiple",
        call: OpenNebula.VM.del,
        callback: deleteVMachineElement,
        elements: vmElements,
        error: onError,
        notify: true
    },

    "VM.log" : {
        type: "single",
        call: OpenNebula.VM.log,
        callback: function(req,res) {
            //after calling VM.log we process the answer
            //update the tab and pop it up again
            res = res['vm_log'];
            var log_lines = res.split("\n");
            var colored_log = '';
            for (var i = 0; i < log_lines.length;i++){
                var line = log_lines[i];
                if (line.match(/\[E\]/)){
                    line = '<span class="vm_log_error">'+line+'</span>';
                }
                colored_log += line + "\n";
            }

            $('#vm_log_tab').html('<pre>'+colored_log+'</pre>')
        },
        error: function(request,error_json){
            $("#vm_log pre").html('');
            onError(request,error_json);
        }
    },
    "VM.snapshot" : {
        type: "single",
        call:  function(params){
            var id = params.data.id;
            var method = "snapshot";
            $.ajax({
                url: "vm/" + id + "/" + method,
                type: "GET",
                dataType: "json",
                success: function(response){
                    return null;
                },
                error: function(response){
                    return null;
                }
            });
        },
        callback: function(req,res) {
            //after calling VM.log we process the answer
            //update the tab and pop it up again
            res = res['vm_log'];
        },
        error: function(request,error_json){
        //$("#vm_log pre").html('');
        onError(request,error_json);
        },
        notify: false
    },
    "VM.startvnc" : {
        type: "single",
        call: OpenNebula.VM.startvnc,
        callback: vncCallback,
        error: onError,
        notify: true
    },

    "VM.stopvnc" : {
        type: "single",
        call: OpenNebula.VM.stopvnc,
        error: onError,
        notify: true
    },
    "VM.redirect" : {
        type: "single",
	call : OpenNebula.VM.redirect,
        callback: RedirectPortCallback,
        error: onError,
        notify: true
    },
    "VM.redirspice" : {
        type: "single",
        call : OpenNebula.VM.redirspice,
        callback: RedirectPortCallback,
        error: onError,
        notify: true
    },
    "VM.monitor" : {
        type: "monitor",
        call : OpenNebula.VM.monitor,
        callback: function(req,response) {
            var info = req.request.data[0].monitor;
            plot_graph(response,'#vm_monitoring_tab',
                       'vm_monitor_',info);
        },
        error: vmMonitorError
    },

    "VM.chown" : {
        type: "multiple",
        call: OpenNebula.VM.chown,
        callback: vmShow,
        elements: vmElements,
        error: onError,
        notify: true
    },
    "VM.chgrp" : {
        type: "multiple",
        call: OpenNebula.VM.chgrp,
        callback: vmShow,
        elements: vmElements,
        error: onError,
        notify: true
    },
    "VM.fetch_permissions" : {
        type: "single",
        call: OpenNebula.VM.show,
        callback : function(request, vm_json){
            var dialog = $('#vm_template_update_dialog form');
            var vm = vm_json.VM;
            setPermissionsTable(vm,dialog);
        },
        error: onError
    },
    "VM.chmod" : {
        type: "single",
        call: OpenNebula.VM.chmod,
        error: onError,
        notify: true
    },
    "VM.attachdisk" : {
        type: "single",
        call: OpenNebula.VM.attachdisk,
        callback: vmShow,
        error: onError,
        notify: true
    },
    "VM.detachdisk" : {
        type: "single",
        call: OpenNebula.VM.detachdisk,
        callback: function(req,res){
            setTimeout(vmShow,1000,req);
        },
        error: onError,
        notify: true
    },
    "VM.help" : {
        type: "custom",
        call: function() {
            hideDialog();
            $('div#vms_tab div.legend_div').slideToggle();
        }
    },
    "VM.TemplateList" : {
        type: "list",
        call: OpenNebula.Template.list,
        callback: function(request, templates_list) {
		var select="";
    		$.each(templates_list,function(){
			var template = this.VMTEMPLATE;
//			select +='<option elem_id="'+template.ID+'" value="'+template.ID+'">'+template.NAME+' (id:'+template.ID+')</option>';	
			select +='<option elem_id="'+template.ID+'" value="'+template.ID+'">'+template.NAME+'</option>';
   		});  
		$('#template_id', $create_vm_dialog).html(select);          
        },
        error: onError
    },
    "VM.TemplateInstantiate" : {
        type: "single",
        call: OpenNebula.Template.instantiate,
        error: onError,
        notify: true
    },
    "VM.ImageList" : {
        type: "list",
        call: OpenNebula.Image.list,
        callback:function(request, images_list) {
	    image_select="";
	    $.each(images_list,function(){
		  var image = this.IMAGE;
		  image_select +='<option elem_id="'+image.ID+'" value="'+image.ID+'">'+image.NAME+'(id:'+image.ID+')</option>';
//		  image_select +='<option elem_id="'+image.ID+'" value="'+image.ID+'">'+image.NAME+'</option>';

            });            
        },
        error: onError
    },
    "VM.NetworkList" : {
        type: "list",
        call: OpenNebula.Network.list,
        callback: function(request, network_list) {
		$.each(network_list,function(){
			if (this.VNET.UNAME == username){
				owner_network = this.VNET.NAME;
			}
		});
        },
        error: onError
    },
    "VM.Fetch_template" : {
        type: "single",
        call: OpenNebula.Template.fetch_template,
        callback: function (request,response) {
		var template_org="";
		var template_context="";
		var context="true";
		var files_list="/srv/one/share/script/init";
		var create_vm_dialog = $('#create_vm_dialog')
                var vm_name = vmname;
                var user_passwd = $('#user_passwd',$create_vm_dialog).val();
		var template_array=response.template.split("\n");
		var username_array=username.split('%');
		for (var i=0; i < template_array.length; i++){
			if (template_array[i].match(/^CONTEXT/)){
                                template_context+="CONTEXT=[\n";
                                template_context+="  USERNAME=\""+username_array[0]+"\",\n";
                                template_context+="  HOSTNAME=\""+vm_name+"\",\n";
                                template_context+="  USER_PASSWD=\""+user_passwd+"\",\n";
                                template_context+="  ROOT_PASSWD=\""+user_passwd+"\",\n";
				if (!template_array[i].match(/^CONTEXT=\[/)){
					context="false";
				}
                        }else if (template_array[i].match(/\s+OSTYPE/)){
                                if (template_array[i].match(/\s+OSTYPE=\"WINDOWS/)){
                                        template_context+="  FILES=\""+files_list+".ps1\", \n";
                                }else{
                                        template_context+="  FILES=\""+files_list+".sh\", \n";
                                }
                                template_org+=template_array[i].replace(/"/g, "\"")+"\n";
			}else if (template_array[i].match(/^NAME/)){
				template_org+="NAME=\""+vm_name+"\"\n";
		//Disable Network Auto Selection for EasyCloud 
		//	}else if (template_array[i].match(/\s+NETWORK=/)){
		//	    	if (template_array[i+1].match(/\s+NETWORK_UNAME=/)){
                //                	if (owner_network.length){
		//				template_org+="  NETWORK=\""+owner_network+"\",\n";
                //                        	template_org+="  NETWORK_UNAME=\""+username+"\" ]\n";
		//				i+=1
                //                	}else{
                //                        	template_org+=template_array[i].replace(/"/g, "\"")+" \n";
                //                        	template_org+=template_array[i+1].replace(/"/g, "\"")+" \n";
		//				i+=1
                //                	}
		//	    	}else{
                //                        if (owner_network.length){
                //                                template_org+="  NETWORK=\""+owner_network+"\",\n";
                //                                template_org+="  NETWORK_UNAME=\""+username+"\" ]\n";
                //                        }else{
                //                        	template_org+=template_array[i].replace(/"/g, "\"")+" \n";
		//			}					
		//		}
			}else if (template_array[i].match(/\s+PASSWD/)){
				var d = new Date();
				template_org+="  PASSWD=\""+d.getTime()+"\",\n";
			}else{
				template_org+=template_array[i].replace(/"/g, "\"")+"\n";
			}
		}
		if ( context == "false" ){
			template_context += " ]\n";
		}
		template_org = template_context + template_org + "\"";
                var vm_temp = { "vm_raw" : template_org };
		var vm_json = { "vm" : vm_temp };
		Sunstone.runAction("VM.create_raw",vm_json);
        },
        error: onError
    },    
    "VM.create_raw" : {
        type: "create",
        call: OpenNebula.VM.create,
        callback: function (params,extra_param){
                Sunstone.runAction("VM.list");
		notifySubmit(tr("Create VM is done"));
	},
        error: onError,
    }
};


// for Ezcloud Demo , close some button ,  resently will open.
var vm_buttons = {
    "VM.refresh" : {
        type: "action",
        text: '<i class="icon-refresh icon-large"></i> <br/> <font class="top-button-font">'+tr("Refresh")+'</font>',
        alwaysActive: true
    },

    "VM.create_dialog" : {
        type: "action",
        text: '<i class="icon-plus icon-large"/></i> <br/> <font class="top-button-font">'+tr("New")+'</font>',
        alwaysActive: true
    },

/*            "VM.suspend" : {
                type: "confirm",
                text: '<i class="icon-pause icon-large"> '+tr("Suspend"),
                tip: tr("This will suspend selected machines")
            },*/
            "VM.resume" : {
                type: "confirm",
                text: '<i class="icon-play icon-large"/></i> <br/> <font class="top-button-font">'+tr("Resume")+'</font>',
                tip: tr("This will resume selected stopped or suspended VMs")
            },
     	    "VM.stop" : {
                type: "confirm",
                text: '<i  class="icon-stop icon-large"/></i> <br/> <font class="top-button-font">'+tr("Stop")+'</font>',
                tip: tr("This will stop selected VMs")
            },
	    "VM.restart" : {
                type: "confirm",
                text: '<i class="icon-share-alt icon-large"></i> <br/> <font class="top-button-font">'+tr("Restart")+'</font>',
                tip: tr("This will redeploy selected VMs (in UNKNOWN or BOOT state)")
            },
	     "VM.reboot" : {
                type : "confirm",
                text: '<i class="icon-repeat icon-large"></i> <br/> <font class="top-button-font">'+tr("Reboot")+'</font>',
                tip: tr("This will send a reboot action to running VMs")
            },
            "VM.reset" : {
                type: "confirm",
                text: '<i class="icon-off icon-large"></i> <br/> <font class="top-button-font">'+tr("Reset")+'</font>',
                tip: tr("This will perform a hard reboot on selected VMs")
            },
/*            "VM.cancel" : {
                type: "confirm",
                text: tr("Cancel"),
                tip: tr("This will cancel selected VMs")
            },*/

/*    "VM.shutdown" : {
        type: "confirm",
        text: tr("Shutdown"),
        tip: tr("This will initiate the shutdown process in the selected VMs")
    },*/

    "action_list" : {
        type: "select",
	condition: mustBeAdmin,
        actions: {

/*    "VM.update_dialog" : {
        type: "action",
        text: tr("Update properties"),
        alwaysActive: true
    },*/

    "VM.chown" : {
        type: "confirm_with_select",
        text: tr("Change owner"),
        select: users_sel,
        tip: tr("Select the new owner")+":",
        condition: mustBeAdmin
    },

    "VM.chgrp" : {
        type: "confirm_with_select",
        text: tr("Change group"),
        select: groups_sel,
        tip: tr("Select the new group")+":",
        condition: mustBeAdmin
    },

            "VM.deploy" : {
                type: "confirm_with_select",
                text: tr("Deploy"),
                tip: tr("This will deploy the selected VMs on the chosen host"),
                select: hosts_sel,
                condition: mustBeAdmin
            },
            "VM.migrate" : {
                type: "confirm_with_select",
                text: tr("Migrate"),
                tip: tr("This will migrate the selected VMs to the chosen host"),
                select: hosts_sel,
                condition: mustBeAdmin

            },
            "VM.livemigrate" : {
                type: "confirm_with_select",
                text: tr("Live migrate"),
                tip: tr("This will live-migrate the selected VMs to the chosen host"),
                select: hosts_sel,
                condition: mustBeAdmin
            },
            /*"VM.hold" : {
                type: "confirm",
                text: tr("Hold"),
                tip: tr("This will hold selected pending VMs from being deployed")
            },*/
            /*"VM.release" : {
                type: "confirm",
                text: tr("Release"),
                tip: tr("This will release held machines")
            },*/
            /*"VM.stop" : {
                type: "confirm",
                text: tr("Stop"),
                tip: tr("This will stop selected VMs")
            },*/ //move to First layout
            "VM.restart" : {
                type: "confirm",
                text: tr("Restart"),
                tip: tr("This will redeploy selected VMs (in UNKNOWN or BOOT state)")
            },
            /*"VM.resubmit" : {
                type: "confirm",
                text: tr("Resubmit"),
                tip: tr("This will resubmits VMs to PENDING state")
            },*/
            "VM.reboot" : {
                type : "confirm",
                text: tr("Reboot"),
                tip: tr("This will send a reboot action to running VMs")
            },
            "VM.reset" : {
                type: "confirm",
                text: tr("Reset"),
                tip: tr("This will perform a hard reboot on selected VMs")
            },
            "VM.cancel" : {
                type: "confirm",
                text: '<i class="icon-trash icon-large"><br/>'+tr("Cancel"),
                tip: tr("This will cancel selected VMs")
            }
        }
	
    },

    "VM.delete" : {
        type: "confirm",
        text: '<i class="icon-trash icon-large"> </i> <br/> <font class="top-button-font"> '+tr("Delete")+'</font>',
        tip: tr("This will delete the selected VMs from the database")
    },

    "VM.help" : {
        type: "action",
        text: '<i class="icon-question-sign icon-large"/> <br/>'+tr("Help"),
        alwaysActive: true
    }
}

var vm_info_panel = {
    "vm_info_tab" : {
        title: tr("Virtual Machine information"),
        content: ""
    },
    "vm_hotplugging_tab" : {
        title: tr("Disks & Hotplugging"),
        content: ""
    },
    "vm_template_tab" : {
        title: tr("VM template"),
        content: ""
    },
    "vm_log_tab" : {
        title: tr("VM log"),
        content: ""
    },
    "vm_history_tab" : {
        title: tr("History information"),
        content: ""
    }
};

var vms_tab = {
    title: tr("Virtual Machines"),
    content: vms_tab_content,
    buttons: vm_buttons,
    tabClass: 'subTab',
//    parentTab: 'vres_tab'
};

SunstoneMonitoringConfig['VM'] = {
    plot: function(monitoring){
        // we have the monitoring information and we need to
        // send it somewhere to be plotted

        // Write total VMs
        $('#totalVMs', $dashboard).text(monitoring['totalVMs'])

        // Calculate bandwidth
        // netUsage object is global variable and stores last values of
        // BU, BD and the time they were stored.
        // According to the current values and time, we can calculate
        // how much bandwith we are using.
        // Once done, we update the netUsage object with the new values
        // for the next time.

        var t = ((new Date().getTime()) - netUsage.time) / 1000 //in secs
        var bandwidth_up = monitoring['netUsageBar'][1].data[0][0] - netUsage.up
        bandwidth_up /= t
        var bandwidth_up_str = humanize_size(bandwidth_up,true) + "B/s" //bytes /sec
        var bandwidth_down = monitoring['netUsageBar'][0].data[0][0] - netUsage.down
        bandwidth_down /= t
        var bandwidth_down_str = humanize_size(bandwidth_down,true) + "B/s" //bytes /sec

        if (bandwidth_up >= 0)
            $('#bandwidth_up', $dashboard).text(bandwidth_up_str)
        if (bandwidth_down >= 0)
            $('#bandwidth_down', $dashboard).text(bandwidth_down_str)

        netUsage.time = new Date().getTime()
        netUsage.up = monitoring['netUsageBar'][1].data[0][0]
        netUsage.down = monitoring['netUsageBar'][0].data[0][0]

        //if (!$dashboard.is(':visible')) return;

        // plot these two graphs
        var container = $('div#vmStatePie',$dashboard);
        SunstoneMonitoring.plot('VM',
                                'statePie',
                                container,
                                monitoring['statePie']);

        container = $('div#netUsageBar',$dashboard);
        SunstoneMonitoring.plot('VM',
                                'netUsageBar',
                                container,
                                monitoring['netUsageBar']);
    },
    monitor: {
        "totalVMs" : {
            operation: SunstoneMonitoring.ops.totalize
        },
        "statePie" : {
            partitionPath: "STATE",
            operation: SunstoneMonitoring.ops.partition,
            dataType: "pie",
            colorize: function(state){
                switch (state) {
                case '0': return "rgb(160,160,160)" //light gray - init
                case '1': return "rgb(239,201,86)" //yellow - pending
                case '2': return "rgb(237,154,64)" //orange - hold
                case '3': return "rgb(108,183,108)" //green - active
                case '4': return "rgb(175,216,248)" //blue - stopped
                case '5': return "rgb(112,164,205)" //dark blue - suspended
                case '6': return "rgb(71,71,71)" //gray - done
                case '7': return "rgb(203,75,75)" //red - failed

                }
            },
            plotOptions : {
                series: { pie: { show: true  } },
                legend : {
                    labelFormatter: function(label, series){
                        return OpenNebula.Helper.resource_state("vm",label) +
                            ' - ' + series.data[0][1] + ' (' +
                            Math.floor(series.percent) + '%' + ')';
                    }
                }
            }
        },
        "netUsageBar" : {
            // Show in a single var the values from netrx and nettx
            paths: [ "NET_RX", "NET_TX" ],
            operation: SunstoneMonitoring.ops.singleBar,
            plotOptions: {
                series: { bars: { show: true,
                                  horizontal: true,
                                  barWidth: 0.5 }
                        },
                yaxis: { show: false },
                xaxis: {
                    min: 0,
                    tickFormatter : function(val,axis) {
                        return humanize_size(val,true);
                    }
                },
                legend: {
                    noColumns: 3,
                    container: '#netUsageBar_legend',
                    labelFormatter: function(label, series){
                        return label + " - " + humanize_size(series.data[0][0],true)
                    }
                }
            }
        }
    }
}


Sunstone.addActions(vm_actions);
Sunstone.addMainTab('vms_tab',vms_tab);
Sunstone.addInfoPanel('vm_info_panel',vm_info_panel);


function vmElements() {
    return getSelectedNodes(dataTable_vMachines);
};

function vmShow(req) {
    Sunstone.runAction("VM.show",req.request.data[0]);
};

// Returns a human readable running time for a VM
function str_start_time(vm){
    return pretty_time(vm.STIME);
};


// Return the IP or several IPs of a VM
function ip_str(vm){
    var nic = vm.TEMPLATE.NIC;
    var ip = '--';
    if ($.isArray(nic)) {
        ip = '';
        $.each(nic, function(index,value){
            ip += value.IP+'<br />';
        });
    } else if (nic && nic.IP) {
        ip = nic.IP;
    };
    return ip;
};

// Returns an array formed by the information contained in the vm_json
// and ready to be introduced in a dataTable
function vMachineElementArray(vm_json){
    var vm = vm_json.VM;
    var state = OpenNebula.Helper.resource_state("vm",vm.STATE);
    var hostname = "--";

    if (state == tr("ACTIVE") || state == tr("SUSPENDED")){
        if (vm.HISTORY_RECORDS.HISTORY.constructor == Array){
            hostname = vm.HISTORY_RECORDS.HISTORY[vm.HISTORY_RECORDS.HISTORY.length-1].HOSTNAME;
        } else {
            hostname = vm.HISTORY_RECORDS.HISTORY.HOSTNAME;
        };
    };

    if (state == tr("ACTIVE")) {
        state = OpenNebula.Helper.resource_state("vm_lcm",vm.LCM_STATE);
    };
    var icon = '<img class=vmstate';
    if (state=="RUNNING")
	icon += ' id="vmstate'+vm.ID+'" src="images/running.png" vmstate="'+state+'" title="'+state+'"></>';
    else if (state=="SUSPENDED" || state=="SHUTDOWN")
	icon += ' id="vmstate'+vm.ID+'" src="images/rest.png" vmstate="'+state+'" > '+state+'</>';
    else if (state=="FAILED" || state=="FAILURE")
	icon += ' id="vmstate'+vm.ID+'" src="images/failure.png" vmstate="'+state+'" > '+state+'</>';
    else
	icon += ' id="vmstate'+vm.ID+'" src="images/unknown.png" vmstate="'+state+'" > '+state+'</>';
var ostype;
if (typeof(vm.TEMPLATE.CONTEXT) != "undefined"){
        if (typeof(vm.TEMPLATE.CONTEXT.OSTYPE) != "undefined")
		ostype = vm.TEMPLATE.CONTEXT.OSTYPE;
	else
		ostype ="";
}
else{
	ostype="";
}

    return [
        '<input class="check_item" type="checkbox" id="vm_'+vm.ID+'" name="selected_items" value="'+vm.ID+'"/>',
	icon, //state
        vm.ID,
        vm.UNAME,
        vm.GNAME,
        vm.NAME,
        vm.TEMPLATE.VCPU,
        humanize_size(vm.MEMORY),
	ostype,
        hostname,
        ip_str(vm),
        str_start_time(vm),
        vncIcon(vm),
        RedirectPortIcon(vm)
    ];
};


// Callback to refresh a single element from the list
function updateVMachineElement(request, vm_json){
    var id = vm_json.VM.ID;
    var element = vMachineElementArray(vm_json);
    updateSingleElement(element,dataTable_vMachines,'#vm_'+id)

    //we update this too, even if it is not shown.
    var $hotplugging_tab = $('div#vm_info_panel div#vm_hotplugging_tab');
    $('#hotplugging_form',$hotplugging_tab).replaceWith(printDisks(vm_json.VM));
    $('tr.at_volatile',$hotplugging_tab).hide();
}

// Callback to delete a single element from the list
function deleteVMachineElement(request){
    deleteElement(dataTable_vMachines,'#vm_'+request.request.data);
}

// Callback to add an element to the list
function addVMachineElement(request,vm_json){
    var id = vm_json.VM.ID;
    var element = vMachineElementArray(vm_json);
    addElement(element,dataTable_vMachines);
}


// Callback to refresh the list of Virtual Machines
function updateVMachinesView(request, vmachine_list){
    var vmachine_list_array = [];

    $.each(vmachine_list,function(){
        vmachine_list_array.push( vMachineElementArray(this));
    });

    updateView(vmachine_list_array,dataTable_vMachines);
    SunstoneMonitoring.monitor('VM', vmachine_list)
    updateVResDashboard("vms",vmachine_list);
};


// Returns the html code for a nice formatted VM history
// Some calculations are performed, inspired from what is done
// in the CLI
function generateHistoryTable(vm){
    var html = ' <table id="vm_history_table" class="info_table" style="width:80%">\
                   <thead>\
                     <tr>\
                         <th>'+tr("Sequence")+'</th>\
                         <th>'+tr("Hostname")+'</th>\
                         <th>'+tr("Reason")+'</th>\
                         <th>'+tr("State change time")+'</th>\
                         <th>'+tr("Total time")+'</th>\
                         <th colspan="2">'+tr("Prolog time")+'</th>\
                     </tr>\
                   </thead>\
                   <tbody>';

    var history = [];
    if (vm.HISTORY_RECORDS.HISTORY){
        if ($.isArray(vm.HISTORY_RECORDS.HISTORY))
            history = vm.HISTORY_RECORDS.HISTORY;
        else if (vm.HISTORY_RECORDS.HISTORY.SEQ)
            history = [vm.HISTORY_RECORDS.HISTORY];
    };

    var now = Math.round(new Date().getTime() / 1000);

    for (var i=0; i < history.length; i++){
        // :TIME time calculations copied from onevm_helper.rb
        var stime = parseInt(history[i].STIME, 10);

        var etime = parseInt(history[i].ETIME, 10)
        etime = etime == 0 ? now : etime;

        var dtime = etime - stime;
        // end :TIME

        //:PTIME
        var stime2 = parseInt(history[i].PSTIME, 10);
        var etime2;
        var ptime2 = parseInt(history[i].PETIME, 10);
        if (stime2 == 0)
            etime2 = 0;
        else
            etime2 = ptime2 == 0 ? now : ptime2;
        var dtime2 = etime2 - stime2;

        //end :PTIME


        html += '     <tr>\
                       <td style="width:20%">'+history[i].SEQ+'</td>\
                       <td style="width:20%">'+history[i].HOSTNAME+'</td>\
                       <td style="width:16%">'+OpenNebula.Helper.resource_state("VM_MIGRATE_REASON",parseInt(history[i].REASON, 10))+'</td>\
                       <td style="width:16%">'+pretty_time(history[i].STIME)+'</td>\
                       <td style="width:16%">'+pretty_time_runtime(dtime)+'</td>\
                       <td style="width:16%">'+pretty_time_runtime(dtime2)+'</td>\
                       <td></td>\
                      </tr>'
    };
    html += '</tbody>\
                </table>';
    return html;

};

// Refreshes the information panel for a VM
function updateVMInfo(request,vm){
    var vm_info = vm.VM;
    var vm_state = OpenNebula.Helper.resource_state("vm",vm_info.STATE);
    var vm_lcm_state = OpenNebula.Helper.resource_state("vm_lcm",vm_info.LCM_STATE);

    var hostname = "--"
    var graphics = vm_info.TEMPLATE.GRAPHICS;

    Sunstone.runAction("VM.TemplateList");
    Sunstone.runAction("VM.ImageList");
 
    if (graphics && graphics.TYPE == "vnc" && vm_lcm_state ==  tr("RUNNING"))
    {
    	Sunstone.runAction("VM.snapshot",vm_info.ID);
    }

    if (vm_state == tr("ACTIVE") || vm_state == tr("SUSPENDED")) {
        if (vm_info.HISTORY_RECORDS.HISTORY.constructor == Array){
            hostname = vm_info.HISTORY_RECORDS.HISTORY[vm_info.HISTORY_RECORDS.HISTORY.length-1].HOSTNAME
        } else {
            hostname = vm_info.HISTORY_RECORDS.HISTORY.HOSTNAME;
        };
    };

    var info_tab = {
        title : tr("VM information"),
        content:
        '<table id="info_vm_table" class="info_table">\
            <thead>\
              <tr><th colspan="2">'+tr("Virtual Machine information")+' - '+vm_info.NAME+'</th></tr>\
            </thead>\
            <tbody>\
              <tr>\
                 <td class="key_td">'+tr("ID")+'</td>\
                 <td class="value_td">'+vm_info.ID+'</td>\
              </tr>\
              <tr>\
                 <td class="key_td">'+tr("Name")+'</td>\
                 <td class="value_td">'+vm_info.NAME+'</td>\
              </tr>\
              <tr>\
                 <td class="key_td">'+tr("Owner")+'</td>\
                 <td class="value_td">'+vm_info.UNAME+'</td>\
              </tr>\
              <tr>\
                 <td class="key_td">'+tr("Group")+'</td>\
                 <td class="value_td">'+vm_info.GNAME+'</td>\
              </tr>\
              <tr>\
                 <td class="key_td">'+tr("State")+'</td>\
                 <td class="value_td">'+tr(vm_state)+'</td>\
              </tr>\
              <tr>\
                 <td class="key_td">'+tr("LCM State")+'</td>\
                 <td class="value_td">'+tr(vm_lcm_state)+'</td>\
              </tr>\
              <tr>\
                 <td class="key_td">'+tr("Hostname")+'</td>\
              <td class="value_td">'+ hostname +'</td>\
              </tr>\
              <tr>\
                 <td class="key_td">'+tr("Start time")+'</td>\
                 <td class="value_td">'+pretty_time(vm_info.STIME)+'</td>\
              </tr>\
              <tr>\
                 <td class="key_td">'+tr("Deploy ID")+'</td>\
                 <td class="value_td">'+(typeof(vm_info.DEPLOY_ID) == "object" ? "-" : vm_info.DEPLOY_ID)+'</td>\
              </tr>\
              <tr><td class="key_td">Permissions</td><td></td></tr>\
              <tr>\
                <td class="key_td">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+tr("Owner")+'</td>\
                <td class="value_td" style="font-family:monospace;">'+ownerPermStr(vm_info)+'</td>\
              </tr>\
              <tr>\
                <td class="key_td">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+tr("Group")+'</td>\
                <td class="value_td" style="font-family:monospace;">'+groupPermStr(vm_info)+'</td>\
              </tr>\
              <tr>\
                <td class="key_td"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+tr("Other")+'</td>\
                <td class="value_td" style="font-family:monospace;">'+otherPermStr(vm_info)+'</td>\
              </tr>\
                 </tbody>\
                </table>\
                <table id="vm_monitoring_table" class="info_table">\
                   <thead>\
                     <tr><th colspan="2">'+tr("Monitoring information")+'</th></tr>\
                   </thead>\
                   <tbody>\
		       <tr>\
                        <td class="key_td">'+tr("Snapshot")+'</td>\
                        <td class="value_td">'+SnapshotIcon(vm_info)+'</td>\
                      </tr>\
                      <tr>\
                        <td class="key_td">'+tr("Net_TX")+'</td>\
                        <td class="value_td">'+vm_info.NET_TX+'</td>\
                      </tr>\
                      <tr>\
                        <td class="key_td">'+tr("Net_RX")+'</td>\
                        <td class="value_td">'+vm_info.NET_RX+'</td>\
                      </tr>\
                      <tr>\
                        <td class="key_td">'+tr("Used Memory")+'</td>\
                        <td class="value_td">'+humanize_size(vm_info.MEMORY)+'</td>\
                      </tr>\
                      <tr>\
                        <td class="key_td">'+tr("Used CPU")+'</td>\
                        <td class="value_td">'+vm_info.TEMPLATE.VCPU+'</td>\
                      </tr>\
                      <tr>\
                        <td class="key_td">'+vncLabel(vm_info)+'</td>\
                        <td class="value_td">'+vncIcon(vm_info)+'</td>\
                      </tr>\
                      <tr>\
                        <td class="key_td">'+RedirectPortProtocol(vm_info)+'</td>\
                        <td class="value_td">'+RedirectPortIcon(vm_info)+'</td>\
                      </tr>\
                    </tbody>\
                </table>'
    };

    var hotplugging_tab = {
        title: tr("Disks & Hotplugging"),
        content: printDisks(vm_info),
	condition: mustBeAdmin
    };

    var template_tab = {
        title: tr("VM Template"),
        content:
        '<table id="vm_template_table" class="info_table" style="width:80%">\
               <thead><tr><th colspan="2">'+tr("VM template")+'</th></tr></thead>'+
                prettyPrintJSON(vm_info.TEMPLATE)+
            '</table>',
	condition: mustBeAdmin
    };

    var log_tab = {
        title: tr("VM log"),
        content: '<div>'+spinner+'</div>',
	condition: mustBeAdmin
    };

    var monitoring_tab = {
        title: tr("Monitoring information"),
        content: generateMonitoringDivs(vm_graphs,"vm_monitor_")
    };

    var history_tab = {
        title: tr("History information"),
        content: generateHistoryTable(vm_info)
    };

    Sunstone.updateInfoPanelTab("vm_info_panel","vm_info_tab",info_tab);
    Sunstone.updateInfoPanelTab("vm_info_panel","vm_hotplugging_tab",hotplugging_tab);
    Sunstone.updateInfoPanelTab("vm_info_panel","vm_template_tab",template_tab);
    Sunstone.updateInfoPanelTab("vm_info_panel","vm_log_tab",log_tab);
    Sunstone.updateInfoPanelTab("vm_info_panel","vm_history_tab",history_tab);
    Sunstone.updateInfoPanelTab("vm_info_panel","vm_monitoring_tab",monitoring_tab);

    //Pop up the info panel and asynchronously get vm_log and stats
    Sunstone.popUpInfoPanel("vm_info_panel");
    Sunstone.runAction("VM.log",vm_info.ID);
    for (var i=0; i<vm_graphs.length; i++){
        Sunstone.runAction("VM.monitor",vm_info.ID,vm_graphs[i]);
    };

    var $info_panel = $('div#vm_info_panel');
    var $hotplugging_tab = $('div#vm_hotplugging_tab', $info_panel);
    $('tr.at_volatile',$hotplugging_tab).hide();
    $('tr.at_image',$hotplugging_tab).show();
}

// Generates the HTML for the hotplugging tab
// This is a list of disks with the save_as, detach options.
// And a form to attach a new disk to the VM, if it is running.
function printDisks(vm_info){
   var html ='\
   <form style="display:inline-block;width:100%" id="hotplugging_form" vmid="'+vm_info.ID+'">\
     <table class="info_table">\
       <thead>\
         <tr><th colspan="2">'+tr("Disks information - Save As and Detach")+'</th></tr>\
       </thead>\
       <tbody>\
       ';


    var disks = []
    if ($.isArray(vm_info.TEMPLATE.DISK))
        disks = vm_info.TEMPLATE.DISK
    else if (!$.isEmptyObject(vm_info.TEMPLATE.DISK))
        disks = [vm_info.TEMPLATE.DISK]

    if (!disks.length){
        html += '<tr id="no_disks_tr"><td class="key_td">\
                   '+tr("No disks to show")+'\
                   </td><td class="value_td"></td></tr>';
    }
    else {

        for (var i = 0; i < disks.length; i++){
            var disk = disks[i];
            html += '<tr disk_id="'+(disk.DISK_ID)+'"><td class="key_td">';
            html += disk.DISK_ID + ' - ' +
                (disk.IMAGE ? disk.IMAGE : "Volatile") + '</td>';
            html += '<td class="value_td">\
'+(vm_info.STATE == "3" ? '\
                       <button value="VM.detachdisk" class="detachdisk" style="float:right;color:#555555;height:26px;">'+tr("Detach")+' <i class="icon-remove icon-large"></i></button>\
' : '')+'\
                       <button value="VM.saveas" class="saveas" style="float:right;margin-right:10px;color:#555555;height:26px;">'+tr("Save")+' <i class="icon-download icon-large"></i></button>\
                       <input style="float:right;width:9em;margin-right:10px;margin-top:3px;" type="text" value="saveas_'+vm_info.ID+'_'+disk.DISK_ID+'" name="saveas_name"></input>\
            <label style="float:right;margin-top:4px;">'+tr("Save_as name")+':</label>'
                +'\
</td>';
        }
    }

    html += '</tbody>\
          </table>';

    // If VM is not RUNNING, then we forget about the attach disk form.
    if (vm_info.STATE != "3"){
        html +='</form>';
        return html;
    }

    // Attach disk form
    html += '<table class="info_table">\
       <thead>\
         <tr><th colspan="2">'+tr("Attach disk to running VM")+'</th></tr>\
       </thead>\
       <tbody>\
         <tr><td class="key_td"><label>'+tr("Type")+':</label></td>\
             <td class="value_td">\
                 <select id="attach_disk_type" style="width:12em;">\
                    <option value="image">'+tr("Existing image")+'</option>\
                    <option value="volatile">'+tr("Volatile disk")+'</option>\
                 </select>\
             </td>\
        </tr>\
         <tr class="at_image"><td class="key_td"><label>'+tr("Select image")+':</label></td>\
             <td class="value_td">\
                   <select name="IMAGE_ID" style="width:12em;">\
                   '+image_select+'\
                   </select>\
             </td>\
         </tr>\
         <tr class="at_volatile"><td class="key_td"><label>'+tr("Size")+' (MB):</label></td>\
             <td class="value_td">\
                <input type="text" name="SIZE" style="width:8em;"></input>\
             </td>\
         </tr>\
         <tr class="at_volatile"><td class="key_td"><label>'+tr("Format")+':</label></td>\
             <td class="value_td">\
                <input type="text" name="FORMAT" style="width:8em;"></input>\
             </td>\
         </tr>\
         <tr class="at_volatile"><td class="key_td"><label>'+tr("Type")+':</label></td>\
             <td class="value_td">\
                   <select name="TYPE" style="width:12em;">\
                       <option value="swap">'+tr("swap")+'</option>\
                       <option value="fs">'+tr("fs")+'</option>\
                   </select>\
             </td>\
         </tr>\
         <tr class="at_volatile at_image"><td class="key_td"><label>'+tr("Device prefix")+':</label></td>\
             <td class="value_td">\
                <input type="text" name="DEV_PREFIX" value="sd" style="width:8em;"></input>\
             </td>\
         </tr>\
<!--\
         <tr class="at_volatile"><td class="key_td"><label>'+tr("Readonly")+':</label></td>\
             <td class="value_td">\
                   <select name="READONLY" style="width:12em;">\
                       <option value="NO">'+tr("No")+'</option>\
                       <option value="YES">'+tr("Yes")+'</option>\
                   </select>\
             </td>\
        </tr>\
        <tr class="at_volatile"><td class="key_td"><label>'+tr("Save")+':</label></td>\
             <td class="value_td">\
                   <select name="SAVE" style="width:12em;">\
                       <option value="NO">'+tr("No")+'</option>\
                       <option value="YES">'+tr("Yes")+'</option>\
                   </select>\
             </td>\
        </tr>\
-->\
        <tr><td class="key_td"></td>\
             <td class="value_td">\
                   <button type="submit" value="VM.attachdisk">Attach</button>\
             </td>\
        </tr>\
       </tbody>\
     </table></form>';

    return html;
}

// Listeners to the disks operations (detach, saveas, attach)
function hotpluggingOps(){
    $('button.detachdisk').live('click', function(){
        var b = $(this);
        var vm_id = b.parents('form').attr('vmid');
        var disk_id = b.parents('tr').attr('disk_id');
        var parent = b.parent();

        Sunstone.runAction('VM.detachdisk', vm_id, disk_id);

        b.html(spinner);
        return false;
    });

    $('button.saveas').live('click', function(){
        var b = $(this);
        var vm_id = b.parents('form').attr('vmid');
        var disk_id = b.parents('tr').attr('disk_id');
        var parent = b.parent();
        var image_name = $('input[name="saveas_name"]',parent).val();
        if (!image_name){
            notifyError('Please provide a name for the new image');
            return false;
        }

        var obj = {
            disk_id : disk_id,
            image_name : image_name,
            type: ""
        };

        Sunstone.runAction('VM.saveas', vm_id, obj);

        b.html(spinner);
        return false;
    });

    $('select#attach_disk_type').live('change',function(){
        var context = $(this).parents('form');
        switch ($(this).val()){
        case "image":
            $('tr.at_volatile',context).hide();
            $('tr.at_image',context).show();
            break;
        case "volatile":
            $('tr.at_image',context).hide();
            $('tr.at_volatile',context).show();
            break;
        };
    });

    $('#hotplugging_form').live('submit',function(){
        var vm_id = $(this).attr('vmid');
        var disk_obj = {};
        switch($('select#attach_disk_type',this).val()){
        case "image":
            var im_id = $('select[name="IMAGE_ID"]',this).val();
            if (!im_id) {
                notifyError(tr("Please select an image to attach"));
                return false;
            }
            disk_obj.IMAGE_ID = $('select[name="IMAGE_ID"]',this).val();
            disk_obj.DEV_PREFIX = $('input[name="DEV_PREFIX"]',this).val();
            break;
        case "volatile":
            disk_obj.SIZE = $('input[name="SIZE"]',this).val();
            disk_obj.FORMAT = $('input[name="FORMAT"]',this).val();
            disk_obj.TYPE = $('select[name="TYPE"]',this).val();
            disk_obj.DEV_PREFIX = $('input[name="DEV_PREFIX"]',this).val();
//            disk_obj.READONLY = $('select[name="READONLY"]',this).val();
//            disk_obj.SAVE = $('save[name="SAVE"]',this).val();
            break;
        }

        var obj = { DISK : disk_obj };
        Sunstone.runAction("VM.attachdisk", vm_id, obj);
        return false;
    });
}

// Sets up the create-template dialog and all the processing associated to it,
// which is a lot.
function setupCreateVMDialog(){

    dialogs_context.append('<div title=\"'+tr("Create Virtual Machine")+'\" id="create_vm_dialog"></div>');
    //Insert HTML in place
    $create_vm_dialog = $('#create_vm_dialog')
    var dialog = $create_vm_dialog;
    dialog.html(create_vm_tmpl);

    //Prepare jquery dialog
    dialog.dialog({
        autoOpen: false,
        modal: true,
        width: 400
    });

    $('button',dialog).button();
    setupTips(dialog);

    $('#create_vm_form',dialog).submit(function(){
        var vm_name = $('#vm_name',$create_vm_dialog).val();
        var template_id = $('#template_id',this).val();
        var user_passwd = $('#user_passwd',this).val();
        var user_passwd_confirm = $('#user_passwd_confirm',this).val();
        var n_times = $('#vm_n_times',this).val();
        var n_times_int=1;
	var CheckData = /[|]|{|}|<|>|'|;|&|#|"|'|!| /;
        if (!template_id.length){
            notifyError(tr("You have not selected a template"));
            return false;
        };

	if (user_passwd != user_passwd_confirm){
            notifyError(tr("These passwords don't match. Try again"));
            return false;
        };

        if (user_passwd.length < 6){
            notifyError(tr("password must be at least 6 characters"));
            return false;
        };

        if (CheckData.test(user_passwd)){
            notifyError(tr("Don't allow special characters in your password !"));
            return false;
        };

        if (n_times.length){
            n_times_int=parseInt(n_times,10);
        };

        if (!vm_name.length){
            vm_name = getTemplateName(template_id);
        };

        if (vm_name.indexOf("%i") == -1){ //no wildcard
            for (var i=0; i< n_times_int; i++){
                //Sunstone.runAction("VM.TemplateInstantiate",template_id,vm_name);
                vmname = vm_name;
                Sunstone.runAction("VM.Fetch_template",template_id);
            };
        } else { //wildcard present: replace wildcard
            for (var i=0; i< n_times_int; i++){
                vmname = vm_name.replace(/%i/gi,i);
                //Sunstone.runAction("VM.TemplateInstantiate",template_id,vm_name);
                Sunstone.runAction("VM.Fetch_template",template_id);
            };
        };

        setTimeout(function(){
            Sunstone.runAction("VM.list");
        },1500);
        $create_vm_dialog.dialog('close');
        return false;
    });
}

// Open creation dialog
function popUpCreateVMDialog(){
    $create_vm_dialog.dialog('open');
}

function setupVMTemplateUpdateDialog(){
    //Append to DOM
    dialogs_context.append('<div id="vm_template_update_dialog" title="'+tr("Update VM properties")+'"></div>');
    var dialog = $('#vm_template_update_dialog',dialogs_context);

    //Put HTML in place
    dialog.html(update_vm_tmpl);

    var height = Math.floor($(window).height()*0.8); //set height to a percentage of the window

    //Convert into jQuery
    dialog.dialog({
        autoOpen:false,
        width:500,
        modal:true,
        height:height,
        resizable:true
    });

    $('button',dialog).button();

    $('#vm_template_update_select',dialog).change(function(){
        var id = $(this).val();
        $('.permissions_table input',dialog).removeAttr('checked');
        $('.permissions_table',dialog).removeAttr('update');
        if (id && id.length){
            var dialog = $('#vm_template_update_dialog');
            Sunstone.runAction("VM.fetch_permissions",id);
        };
    });

    $('.permissions_table input',dialog).change(function(){
        $(this).parents('table').attr('update','update');
    });

    $('form',dialog).submit(function(){
        var dialog = $(this);
        var id = $('#vm_template_update_select',dialog).val();
        if (!id || !id.length) {
            $(this).parents('#vm_template_update_dialog').dialog('close');
            return false;
        };

        var permissions = $('.permissions_table',dialog);
        if (permissions.attr('update')){
            var perms = {
                octet : buildOctet(permissions)
            };
            Sunstone.runAction("VM.chmod",id,perms);
        };

        $(this).parents('#vm_template_update_dialog').dialog('close');
        return false;
    });
};

function popUpVMTemplateUpdateDialog(){
    var select = makeSelectOptions(dataTable_vMachines,
                                   1,//id_col
                                   4,//name_col
                                   [],
                                   []
                                  );
    var sel_elems = getSelectedNodes(dataTable_vMachines);


    var dialog =  $('#vm_template_update_dialog');
    $('#vm_template_update_select',dialog).html(select);
    $('#vm_template_update_textarea',dialog).val("");
    $('.permissions_table input',dialog).removeAttr('checked');
    $('.permissions_table',dialog).removeAttr('update');

    if (sel_elems.length >= 1){ //several items in the list are selected
        //grep them
        var new_select= sel_elems.length > 1? '<option value="">Please select</option>' : "";
        $('option','<select>'+select+'</select>').each(function(){
            var val = $(this).val();
            if ($.inArray(val,sel_elems) >= 0){
                new_select+='<option value="'+val+'">'+$(this).text()+'</option>';
            };
        });
        $('#vm_template_update_select',dialog).html(new_select);
        if (sel_elems.length == 1) {
            $('#vm_template_update_select option',dialog).attr('selected','selected');
            $('#vm_template_update_select',dialog).trigger("change");
        };
    };

    dialog.dialog('open');
    return false;
};

//Prepares autorefresh
function setVMAutorefresh(){
     setInterval(function(){
         var checked = $('input.check_item:checked',dataTable_vMachines);
         var filter = $("#datatable_vmachines_filter input",
                        dataTable_vMachines.parents('#datatable_vmachines_wrapper')).attr('value');
         if (!checked.length && !filter.length){
             Sunstone.runAction("VM.autorefresh");
         };
     },INTERVAL+someTime());
}

//This is taken from noVNC examples
function updateVNCState(rfb, state, oldstate, msg) {
    var s, sb, cad, klass;
    s = $D('VNC_status');
    sb = $D('VNC_status_bar');
    cad = $D('sendCtrlAltDelButton');
    switch (state) {
    case 'failed':
    case 'fatal':
        klass = "VNC_status_error";
        break;
    case 'normal':
        klass = "VNC_status_normal";
        break;
    case 'disconnected':
    case 'loaded':
        klass = "VNC_status_normal";
        break;
    case 'password':
        klass = "VNC_status_warn";
        break;
    default:
        klass = "VNC_status_warn";
    }

    if (state === "normal") { cad.disabled = false; }
    else                    { cad.disabled = true; }

    if (typeof(msg) !== 'undefined') {
        sb.setAttribute("class", klass);
        s.innerHTML = msg;
    }
}

//setups VNC application
function setupVNC(){

    //Append to DOM
    dialogs_context.append('<div id="vnc_dialog" title=\"'+tr("VNC connection")+'\"></div>');
    $vnc_dialog = $('#vnc_dialog',dialogs_context);
    var dialog = $vnc_dialog;

    dialog.html('\
      <div id="VNC_status_bar" class="VNC_status_bar" style="margin-top: 0px;">\
         <table border=0 width="100%"><tr>\
            <td><div id="VNC_status">'+tr("Loading")+'</div></td>\
            <td width="1%"><div id="VNC_buttons">\
            <input type=button value="Send CtrlAltDel"\
                   id="sendCtrlAltDelButton">\
            </div></td>\
          </tr></table>\
        </div>\
        <canvas id="VNC_canvas" width="640px" height="20px">\
            '+tr("Canvas not supported.")+'\
        </canvas>\
');

    dialog.dialog({
        autoOpen:false,
        width:1050,
        modal:true,
        height:770,
        resizable:true,
        closeOnEscape: false
    });

    $('#sendCtrlAltDelButton',dialog).click(function(){
        rfb.sendCtrlAltDel();
        return false;
    });

    dialog.bind( "dialogclose", function(event, ui) {
        var id = $vnc_dialog.attr('vm_id');
        rfb.disconnect();
        Sunstone.runAction("VM.stopvnc",id);
    });

    $('.vnc').live("click",function(){
        //Which VM is it?
        var id = $(this).attr('vm_id');
        //Set attribute to dialog
        $vnc_dialog.attr('vm_id',id);
        //Request proxy server start
        Sunstone.runAction("VM.startvnc",id);
        return false;
    });
}

function vncCallback(request,response){
    rfb = new RFB({'target':       $D('VNC_canvas'),
                   'encrypt':      $('#config_table #wss_checkbox').is(':checked'),
                   'true_color':   true,
                   'local_cursor': true,
                   'shared':       true,
                   'updateState':  updateVNCState});
    //fetch things from clicked element host - port - password
    vnc_port = response["port"];

    //Hopefully this is returning sunstone server address, where
    //the proxy is running
    vnc_host = window.location.hostname;
    vnc_pw = response["password"];

    setTimeout(function(){
        rfb.connect(vnc_host, vnc_port, vnc_pw);
        $vnc_dialog.dialog('open');
    },4000);

}
function vncIcon(vm){
    var graphics = vm.TEMPLATE.GRAPHICS;
    var port = vm.TEMPLATE.GRAPHICS.PORT;
    var state = OpenNebula.Helper.resource_state("vm_lcm",vm.LCM_STATE);
    var gr_icon;

    if (graphics && graphics.TYPE == "vnc" && state == tr("RUNNING")){
        gr_icon = '<a class="vnc" href="#" vm_id="'+vm.ID+'">';
        gr_icon += '<img src="images/vnc_on.png" alt=\"'+tr("Open VNC Session")+'\" /></a>';
    }
    else {
	if (graphics && graphics.TYPE == "spice" && state == tr("RUNNING")){
		gr_icon =  '<a class="redir_spice" href="#" vm_id="'+vm.ID+'" vm_port="'+port+'" vm_loc="spice">';
	        gr_icon += '<img src="images/spice.png" alt=\"'+tr("Open SPICE Session")+'\" /></a>';	
	}
	else if (graphics && graphics.TYPE == "spice" && state != tr("RUNNING")){
		gr_icon = '<img src="images/spice_off.png" alt=\"'+tr("SPICE Disabled")+'\" />';
	}
    	else{
        	gr_icon = '<img src="images/vnc_off.png" alt=\"'+tr("VNC Disabled")+'\" />';
	}
    }
    return gr_icon;
}

function vncLabel(vm){
    var graphics = vm.TEMPLATE.GRAPHICS;
    var gr_label;
    if (graphics && graphics.TYPE == "vnc"){
        return tr("VNC Session");
    }
    else {
        if (graphics && graphics.TYPE == "spice"){
                return tr("SPICE Session");
        }
        else{
                return tr("VNC Session");
        }
    }
}


function SnapshotIcon(vm){
    var graphics = vm.TEMPLATE.GRAPHICS;
    var state = OpenNebula.Helper.resource_state("vm_lcm",vm.LCM_STATE);
    var gr_icon;
    var rand1 =  Math.floor((Math.random()*1000+1));
    var rand2 =  Math.floor((Math.random(2)*1000+1));

    if (graphics && graphics.TYPE == "vnc" && state == "RUNNING"){
        gr_icon = '<img src="images/vncsnapshot/'+vm.ID+'.jpg?'+rand1+'.'+rand2+'" />';
    }
    else {
        gr_icon = '<img src="images/vncsnapshot/no_signal_m.jpg" />';
    }
    return gr_icon;
}

function setupRedirectPort(){

        dialogs_context.append('<div id="redir_dialog" title=\"'+tr("Redirect Port Information")+'\"></div>');
        $redir_dialog= $('#redir_dialog',dialogs_context);
        var dialog = $redir_dialog;

        dialog.html('\
                <div id="RedirectPort_Info" class="RedirectPort_Info" style="margin-top: 0px;">\
                <table border=0 width="100%"><tr>\
                 <td width="200"><div id="RedirectPort_Info_image"></div></td>\
                 </div></td>\
		 <td><div id="RedirectPort_Info_output">'+tr("Loading")+'</td>\
		 </div>\
                </tr></table>\
                </div>\
');
        dialog.dialog({
                autoOpen:false,
                width:600,
                model:true,
                height:200,
                resizeable:false,
                closeOnEscape:true
        });
        dialog.bind("dialogclose",function(event, ui){

        });
	


	
	$('.redir_spice').live("click",function(){

		var id=$(this).attr('vm_id');
                var port = $(this).attr('vm_port');
                var loc = $(this).attr('vm_loc');
                if (loc == "spice"){
                        Sunstone.runAction("VM.redirspice",id,port);
                }
                return false;
	});

        $('.redir').live("click",function(){
                var id = $(this).attr('vm_id');
		var port = $(this).attr('vm_port');
		var loc = $(this).attr('vm_loc');
                Sunstone.runAction("VM.redirect",id,port);
		
                return false;
        });
}

function RedirectPortCallback(request,response){
   	setTimeout(function(){
        var srv_hostname = window.location.host;
        srv_hostname = srv_hostname.substring(0,srv_hostname.indexOf(":"));
	var port;
	var id = response["id"];
	if ( response["loc"]  == "spice" ){
		port = $(".redir_spice").attr('vm_port');
	}
	else{
	 	$(".redir").each(function(i){
			if ($(this).attr('vm_id') == id){
				port = $(this).attr('vm_port');
				return false;
				//"We can stop the loop from within the callback function by returning false."
				// each api by Jquery
				//
			}
	        });
	}
	var connecting_tool_image ='<a class="connecting_info">';
	var connecting_tool;
	if ( port == "3389" ){
		connecting_tool = tr("To connect to the Virtual Machine , you can use RDP tools to connect. copy above connect information,and paste to your RDP tools");
		connecting_tool_image += '<img src="images/rdp_icon_big.png" alt=\"'+tr("RDP TOOLS")+'\" /></a>';
	}
	else{
		if ( port == "22" ){
			connecting_tool = tr("To connect to the Virtual Machine , you can use SSH tools to connect. copy above connect information,and paste to your SSH tools");
			connecting_tool_image += '<img src="images/ssh_icon_big.png" alt=\"'+tr("SSH TOOLS")+'\" /></a>';
		}
		else{
			connecting_tool = tr("To connect to the Virtual Machine , you can use SPICE tools to connect. copy above connect information,and paste to your SPICE tools");
                        connecting_tool_image += '<img src="images/spice_icon_big.png" alt=\"'+tr("SSH TOOLS")+'\" /></a>';
		}
	}
	$('#RedirectPort_Info_image').html(connecting_tool_image);
	$('#RedirectPort_Info_output').html(tr("Connecting information")+'</br></br><input type=text readonly=false id=\'connecting_textarea\' value=\"\" style=\'width:250px;height:15px;\'/></br></br>'+connecting_tool);
	$('#connecting_textarea').attr("value",function(){	
	return	srv_hostname+":"+response["info"];
	});
        $redir_dialog.dialog('open');
   },3000);
};

function RedirectPortProtocol(vm){
   var ostype;
   var protocol;
   if (typeof(vm.TEMPLATE.CONTEXT) != "undefined"){
	if (typeof(vm.TEMPLATE.CONTEXT.OSTYPE) != "undefined"){
                     ostype = vm.TEMPLATE.CONTEXT.OSTYPE;
	             if ( ostype == "WINDOWS" ){
                     	protocol=tr("RDP Session");
                     }
  		     else{
                        protocol=tr("SSH Session");
                     }
	}
	else{
		protocol = "";
	}	
   }
   else{
	protocol  = "";
   }    
   return protocol;
}
function RedirectPortIcon(vm){
   var redir_icon;
   var ostype;
   var state = OpenNebula.Helper.resource_state("vm_lcm",vm.LCM_STATE);
   if (typeof(vm.TEMPLATE.CONTEXT) != "undefined"){
   	if (typeof(vm.TEMPLATE.CONTEXT.OSTYPE) != "undefined"){
        	ostype = vm.TEMPLATE.CONTEXT.OSTYPE;
                	if ( ostype == "WINDOWS"  && state == tr("RUNNING") ){
                        	redir_icon = '<a class="redir" href="#" vm_id="'+vm.ID+'" vm_port="3389">';
                        	redir_icon += '<img src="images/rdp_icon.png" alt=\"'+tr("RDP Port")+'\" /></a>';
		        }
			else if ( ostype == "WINDOWS" && state != tr("RUNNING") ){
                                redir_icon = '<img src="images/rdp_off.png" alt=\"'+tr("RDP Port")+'\" /></a>';
			}
                     	else if ( ostype != "WINDOWS" && state == tr("RUNNING") ) {
                        	redir_icon = '<a class="redir" href="#" vm_id="'+vm.ID+'" vm_port="22">';
                               	redir_icon += '<img src="images/ssh_icon.png" alt=\"'+tr("SSH Port")+'\" /></a>';
                     	}
			else {
                                redir_icon = '<img src="images/ssh_off.png" alt=\"'+tr("SSH Port")+'\" /></a>';				
			}
	}
        else{
        	redir_icon = "";
        }
   }
   else{
    	redir_icon  = "";
   }		
	return redir_icon;

}

// Special error callback in case historical monitoring of VM fails
function vmMonitorError(req,error_json){
    var message = error_json.error.message;
    var info = req.request.data[0].monitor;
    var labels = info.monitor_resources;
    var id_suffix = labels.replace(/,/g,'_');
    var id = '#vm_monitor_'+id_suffix;
    $('#vm_monitoring_tab '+id).html('<div style="padding-left:20px;">'+message+'</div>');
}
function setupVMStateChangeButtons(){

    var context = dataTable_vMachines.parents('form');

    $('.last_action_button',context).button("disable");
    $('.top_button, .list_button',context).button("disable");
    //These are always enabled
    $('.create_dialog_button',context).button("enable");
    $('.alwaysActive',context).button("enable");



    $('tbody input.check_item',dataTable_vMachines).live("change",function(){
	
	var table = $('tbody',dataTable_vMachines);          
	var nodes = $ ('tr',table);          
	

	$('input.check_item:not(input.check_item:checked)').removeAttr('ischecked');
	// check , options is not checked , remove 'custom Attr'.

	var vm_id =   $("input.check_item:checked[ischecked!='true']",nodes).val();
	// read user check options,id value.
        $('input.check_item:checked',nodes).attr('ischecked','true');
	// if click button done. attach attr to is option, 'is checked' custom attr.
	
	var vm_state = $("#vmstate"+vm_id+"",nodes).attr('vmstate');
	//'after option is checked' read this option vmstate, 
	var checked_length = $('input.check_item:checked',nodes).length;
	var last_action_b = $('.last_action_button',context);
        var total_length = nodes.length;

	if (checked_length) {
	
		if (last_action_b.length && last_action_b.val().length){
            		last_action_b.button("enable");
	         };		
		 //enable checkall box
	 	if (total_length == checked_length){
            		$('.check_all',dataTable_vMachines).attr('checked','checked');
       		} 
		else {
            		$('.check_all',dataTable_vMachines).removeAttr('checked');
        	};
		switch (vm_state){
			case 'RUNNING' :
			$(".top_button[value='VM.stop']").button("enable");
			$(".top_button[value='VM.suspend']").button("enable");
			$(".top_button[value='VM.reboot']").button("enable");
			$(".top_button[value='VM.reset']").button("enable");
			$(".top_button[value='VM.migrate']").button("enable");
			$(".top_button[value='VM.shutdown']").button("enable");
			
			break;
			case  'STOPPED' :
			case  'SUSPENDED' :
			$(".top_button[value='VM.resume']").button("enable");
			break;
			case  'UNKNOWN' :
			case  'BOOT' :
                        $(".top_button[value='VM.restart']").button("enable");
			break;
			default :
	                $('.top_button').button("disable");
			break;
                      
		}
/*		if( vm_state == "RUNNING" ){
                        $(".top_button[value='VM.stop']").button("enable");
                }
                else if ( vm_state  ==  "STOPPED" ){
                        $(".top_button[value='VM.resume']").button("enable");
		}
		
		else{
//			$('.top_button').button("disable");
		};*/

		// when click anyVM, to do thing.
		$('.list_button',context).button("enable");
        	$(".top_button[value='VM.delete']").button("enable");

	}
	else { //no elements cheked
        //disable action buttons, uncheck checkAll 
		$('.check_all',dataTable_vMachines).removeAttr('checked');
        	$('.top_button, .list_button',context).button("disable");
        	last_action_b.button("disable");
	};
    //any case the create dialog buttons should always be enabled.   
      $('.create_dialog_button',context).button("enable");
      $('.alwaysActive',context).button("enable");
    });
}
// At this point the DOM is ready and the sunstone.js ready() has been run.
$(document).ready(function(){

    dataTable_vMachines = $("#datatable_vmachines",main_tabs_context).dataTable({
        "bJQueryUI": true,
        "sDom" : '<"H"lfrC>t<"F"ip>',
        "oColVis": {
            "aiExclude": [ 0 ]
        },
        "bSortClasses": false,
        "sPaginationType": "full_numbers",
        "bAutoWidth":false,
        "aoColumnDefs": [
            { "bSortable": false, "aTargets": ["check"] },
            { "sWidth": "80px", "aTargets": [] },
            { "sWidth": "60px", "aTargets": [7,8] },
            { "sWidth": "35px", "aTargets": [0,6,1,2,12,13] },
            { "sWidth": "150px", "aTargets": [11] },
            { "sWidth": "100px", "aTargets": [3,4,9,10] },
            { "bVisible": false, "aTargets": [3,4,9,10]}
        ],
        "oLanguage": (datatable_lang != "") ?
            {
                sUrl: "locale/"+lang+"/"+datatable_lang
            } : ""
    });

    dataTable_vMachines.fnClearTable();
    addElement([
        spinner,
        '','','','','','','','','','','','',''],dataTable_vMachines);
    Sunstone.runAction("VM.list");

    setupCreateVMDialog();
    setupVMTemplateUpdateDialog();
    setVMAutorefresh();
    setupVNC();
    setupRedirectPort();
    setupVMStateChangeButtons();
    hotpluggingOps();
    Sunstone.runAction("VM.TemplateList");
    Sunstone.runAction("VM.ImageList");
    Sunstone.runAction("VM.NetworkList");


    initCheckAllBoxes(dataTable_vMachines);
//    tableCheckboxesListener(dataTable_vMachines);(Enable SetupVMStateChangeButton() Function);
    infoListener(dataTable_vMachines,'VM.showinfo');

    $('div#vms_tab div.legend_div').hide();
});
