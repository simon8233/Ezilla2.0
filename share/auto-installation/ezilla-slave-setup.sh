#!/bin/bash
# Author: Chang-Hsing Wu <hsing _at_ nchc narl org tw>
#         Serena Yi-Lun Pan <serenapan _at_ nchc narl org tw>
#         Jonathan CHI-Ming Chen <jonchen _at_ nchc narl org tw>
# License:GPL
# The shell script modify Ezilla server config file
# 1. GET oneadmin UID,and GID.
# 2. setup addhost

source "$AUTO_INSTALL_WORKSPACE/ezilla-slave-variable"

function SetupSlaveAccount(){
    oneadmin_UID=`cat /etc/passwd |grep oneadmin|awk -F: '{print $3}'`
    oneadmin_GID=`cat /etc/passwd |grep oneadmin|awk -F: '{print $4}'`
    sed -i "s/^user/user --uid=$oneadmin_UID"/g $SLAVE_KICKSTART
    sed -i "s/groupmod -g/groupmod -g $oneadmin_GID"/g $SLAVE_KICKSTART
}
function SetupSlaveAddHost(){

    ## Setup Slave
    declare -i modify_line=$(cat -n $SLAVE_KICKSTART | grep '### Addhost script'| awk  'NR==1 {print $1}')
    start_line=`expr ${modify_line} + 1`
    sed -i "${start_line}i echo \'su oneadmin -s /bin/bash -c \"ssh 10.0.0.254 $SLAVE_ONE_ADDHOST_SCRIPT \$ipaddr\" \' >> /etc/rc.local " $SLAVE_KICKSTART             

}
SetupSlaveAccount
SetupSlaveAddHost
