#!/bin/bash
# Author: Chang-Hsing Wu <hsing _at_ nchc narl org tw>
#         Serena Yi-Lun Pan <serenapan _at_ nchc narl org tw>
#         Jonathan CHI-Ming Chen <jonchen _at_ nchc narl org tw>
# License:GPL
# $1 
# 1 = 1 ethernet card
# 2 = 2 ethernet card
### Network setting
source "$AUTO_INSTALL_WORKSPACE/ezilla-slave-variable"
source "$AUTO_INSTALL_WORKSPACE/ezilla-slave-config"
function SetupSlaveNetwork(){

#    declare -i modify_line=$(cat -n $SLAVE_KICKSTART | grep '### Network setting' | awk 'NR==1 {print $1}')   
#    start_line=`expr ${modify_line} + 1`
if [ ! -d $SLAVE_WEB_KICKSTART_DIR ];then
    mkdir -p $SLAVE_WEB_KICKSTART_DIR
fi
/bin/cp $SLAVE_NETWORK_SCRIPT $SLAVE_WEB_KICKSTART_DIR
#    sed -i "${start_line}i wget http://10.0.0.254/kickstart/network_script.sh -O /root/network_script.sh" $SLAVE_KICKSTART
#    start_line=`expr ${start_line} + 1`
#    sed -i "${start_line}i chmod +x /root/network_script.sh" $SLAVE_KICKSTART
#    start_line=`expr ${start_line} + 1`
 #   start_line=`expr ${start_line} + 1`
    

#autostart_xml="/etc/libvirt/qemu/networks/autostart/default.xml"
#if [ -e $autostart_xml ]; then
#    rm /etc/libvirt/qemu/networks/autostart/default.xml
#fi

#virbr_xml="/etc/libvirt/qemu/networks/default.xml"
#if [ -e $virbr_xml ]; then
#    rm /etc/libvirt/qemu/networks/default.xml
#fi




    

}
SetupSlaveNetwork
