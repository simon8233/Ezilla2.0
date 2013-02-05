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
var diskver_dialog;
var config_response;
var ezilla_diskver_step1 = '\
';
var ezilla_diskver_wizard ='\
<table align="center"  border="0" cellpadding="0" cellspacing="0">\
    <tbody><tr><td>\
        <div id="wizard" class="swMain">\
            <ul class="anchor">\
                <li><a href="#step-1" class="selected" isdone="1" rel="1">\
                    <label class="stepNumber">1</label>\
                    <span class="stepDesc">\
                       Step 1<br>\
                       <small>'+tr("Welcome")+'</small>\
                    </span>\
                </a></li>\
                <li><a href="#step-2" class="disabled" isdone="0" rel="2">\
                    <label class="stepNumber">2</label>\
                    <span class="stepDesc">\
                       Step 2<br>\
                       <small>'+tr("Choose Your Installation")+'</small>\
                    </span>\
                </a></li>\
                <li><a href="#step-3" class="disabled" isdone="0" rel="3">\
                    <label class="stepNumber">3</label>\
                    <span class="stepDesc">\
                       Step 3<br>\
                       <small>'+tr("Disk enviroment")+'</small>\
                    </span>\
                 </a></li>\
                <li><a href="#step-4" class="disabled" isdone="0" rel="4">\
                    <label class="stepNumber">4</label>\
                    <span class="stepDesc">\
                       Step 4<br>\
                       <small>'+tr("Network enviroment")+'</small>\
                    </span>\
                </a></li>\
                 <li><a href="#step-5" class="disabled" isdone="0" rel="5">\
                    <label class="stepNumber">5</label>\
                    <span class="stepDesc">\
                       Step 5<br>\
                       <small>'+tr("Finish")+'</small>\
                    </span>\
                </a></li>\
            </ul>\
            <div id="step-1" class="content" style="display: block;">\
                <h2 class="StepTitle">'+tr("Welcome")+'</h2>\
                <div class="StepContext">\
                    '+tr("Welcome to Ezilla-diskver setup")+'<br>\
                    '+tr("The wizard will help your setup your ezilla slave node.")+'<br>\
                    '+tr("When you finish the wizard , must booting your slave node for installation.")+'<br>\
                </div>\
            </div>\
            <div id="step-2" class="content" style="display: none; ">\
                <h2 class="StepTitle">'+tr("Choose Your Installation")+'</h2>\
                <div class="StepContext">\
                    '+tr("You can select Install mode on this section")+'<br>\
                    <form>\
                    <input type="radio" name="install_mode" value="default" ><label>'+tr("Default")+'</label><br>\
                    <input type="radio" name="install_mode" value="custom"  checked="checked" ><label>'+tr("Custom")+'</label><br>\
                    </form>\
                </div>\
            </div>\
            <div id="step-3" class="content" style="display: none; ">\
                <h2 class="StepTitle">'+tr("Slave node Disk enviroment")+'</h2>\
                <div class="StepContext">\
                    '+tr("What kind of the disk is used to install ezilla project on your server?")+'<br>\
                    <label>sda</label><input type="checkbox" name="disk" value="sda" checked="checked" ><br>\
                    <label>sdb</label><input type="checkbox" name="disk" value="sdb" ><br>\
                    <label>hda</label><input type="checkbox" name="disk" value="hda" ><br>\
                    <label>hdb</label><input type="checkbox" name="disk" value="hdb" ><br>\
                    <label>'+tr("Other")+'</label><input id="disk_other" type="text" name="disk" value=""><br>\
                    <hr>\
                    '+tr("What kind of the file system is used to put VM images?")+'<br>\
                    <label>SCP</label><input type="radio" name="filesystem" value="scp"><br>\
                    <label>NFS</label><input type="radio" name="filesystem" value="nfs"><br>\
                    <label>MooseFS</label><input type="radio" name="filesystem" value="moosefs" checked="checked"><br>\
               </div>\
            </div>\
            <div id="step-4" class="content" style="display: none; ">\
                <h2 class="StepTitle">'+("Slave node Network enviroment")+'</h2>\
                <div class="StepContext">\
                    '+tr("How many network card of the machine in your environments?(1-2)")+'<br>\
                    <label style="width:200px">1 Ethernet card</label><input type="radio" name="net_card" value="1" checked="checked" ><br>\
                    <label style="width:200px">2 Ethernet card</label><input type="radio" name="net_card" value="2" ><br>\
                </div>\
            </div>\
            <div id="step-5" class="content" style="display: none; ">\
                <h2 class="StepTitle">'+("Installation Complete")+'</h2>\
                <div  class="StepContext">\
                    '+("Setup has finished")+'<br>\
                    '+("then Must boot your Slave Node")+'<br>\
                    '+("AND Follow Your Bios guide,step by step.set slave node with pxe booting ")+'<br>\
                </div>\
            </div>\
        </div>\
   </td></tr></tbody>\
    </table>';

var diskver_tab_content =
'<form>\
<table id="diskver_table" style="width:100%">\
    <tr>\
      <td>\
    <div class ="panel">\
<h3>'+tr("Ezilla  Auto-Installation Configuration") + '</h3>\
    <div class="panel_info">\
        <table class="info_table">\
        <tr>\
            <td class="key_td">'+tr("Ezilla Auto-Installation Service for Slave node") +'</td>\
            <td class="value_td">\
                <input type="checkbox" class="iButton" id="EzillaAutoInstallation" />\
            </td>\
        </tr>\
        <tr id="SetupYourSlaveEnvironment" style="display:none;" >\
            <td class="key_td">'+tr("Setup Your Slave environment") +'</td>\
            <td class="value_td" style="text-align:left;"><button type="button" style="height:27px;width:89px;" id="setupSlaveEnv">'+tr("setup")+'</button>\
            </td>\
        </tr>\
          </table>\
        </div>\
        </div>\
    </td>\
  </tr>\
</table>\
</form>';

var diskver_actions = {
    "Diskver.startInstallServ" :  {
        type : "single",
        call : OpenNebula.Diskver.startInstallserv,
        callback : notifyError("OK"),
        error: onError,
        notify :true
    },
    "Diskver.stopInstallServ" : {
        type : "single",
        call : OpenNebula.Diskver.stopInstallserv,
        callback : notifyError("OK"),
        error: onError,
        notify: true        
    },
    "Diskver.wizardSetup": {
        type: "custom",
        call : OpenNebula.Diskver.wizardSetup,
        callback : notifyError("OK"),
        error:onError,
        notify: true
    },/*
    "Diskver.diskverlist":{
        type: "list",
        call: OpenNebula.Config.list
        callback:notifyError("OK"),
        error: oneError
    },*/
   
};

var diskver_tab = {
    title: tr("Slave Node Setup"),
    content: diskver_tab_content,
    tabClass: "subTab"
};

Sunstone.addActions(diskver_actions);
Sunstone.addMainTab('diskver_tab',diskver_tab);



// Update secure websockets configuration
// First we perform a User.show(). In the callback we update the user template
// to include this parameter.
// Then we post to the server configuration so that it is saved for the session
// Note: the session is originally initialized to the user VNC_WSS if present
// otherwise it is set according to sunstone configuration
// TO DO improve this, server side should take care

// ezilla disk-ver setup .
// dialog ver = diskver_dialog
function setupDiskVerSetting(){
//    $('.setup_append').append('<div style="display:none;"title=\"'+tr("Setting Ezilla Disk-ver environment")+'\" id="diskver_dialog" class="diskver_class"></div>');
    dialogs_context.append('<div title=\"'+tr("Setting Ezilla Disk-ver environment")+'\" id="diskver_dialog" class="diskver_class"></div>');
    $diskver_dialog = $('#diskver_dialog');
    var dialog = $diskver_dialog;
    dialog.html(ezilla_diskver_wizard);
   
    dialog.dialog({
        autoOpen:  false,
        height:450,
        width: 1020,
        resizeable:true,
        closeOnEscape:false
    });
    $('#wizard').smartWizard({
        onLeaveStep:leaveAStepCallback,
        onFinish:onFinishCallback
    });
    $('button#setupSlaveEnv').button("enable").click(function(){
        dialog.dialog('open');
    });
   
    $('input#EzillaAutoInstallation').iButton({
    change:function($input){
        if ( $input.is(":checked") ){
            //Sunstone.runAction("Config.startInstallServ");
            $('#diskver_table #SetupYourSlaveEnvironment').show();
        }
        else {
            //Sunstone.runAction("Config.stopInstallServ");
            $('#diskver_table #SetupYourSlaveEnvironment').hide();
        }
    }
    }); // ibutton example.
};
function leaveAStepCallback(obj){
        var step_num= obj.attr('rel'); // get the current step number
        return validateSteps(step_num); // return false to stay on step and true to continue navigation 
}
function onFinishCallback(){
        
        diskver_wizard=$('div#wizard');
        install_mode = $('input[name=install_mode]:checked',diskver_wizard).val();
        disk = new Array();
        $('input[name=disk]:checked',diskver_wizard).each(function(i){
            disk[i] = this.value;
        });
        
        filesystem = $('input[name=filesystem]:checked',diskver_wizard).val();
        net_card = $('input[name=net_card]:checked',diskver_wizard).val();        
        var config_diskver = {
            "install_mode":install_mode, 
            "disk":disk,            
            "filesystem":filesystem,
            "net_card":net_card
        };
        Sunstone.runAction("Diskver.wizardSetup",config_diskver);
        dialog = $('#diskver_dialog');
        dialog.dialog('close');
}
function validateSteps(stepnumber){
        var isStepValid = true;
        // validate step 1
        if(stepnumber == 1){
        // Your step validation logic
        // set isStepValid = false if has errors
        }
        return true; 

}
function validateAllSteps(){
        var isStepValid = true;
        // all step validation logic     
return isStepValid;
}
$(document).ready(function(){

    $('#iButton').iButton();
    setupDiskVerSetting(); 
});
