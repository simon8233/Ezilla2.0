#!/bin/bash
#-------------------------------------------------------------------------------
# Copyright (C) 2013
#
# This file is part of ezilla.
#
# This program is free software: you can redistribute it and/or modify it
# under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE. See the GNU General Public License
# for more details.
#
# You should have received a copy of the GNU General Public License along with
# this program. If not, see <http://www.gnu.org/licenses/>
#
# Author: Chang-Hsing Wu <hsing _at_ nchc narl org tw>
#         Serena Yi-Lun Pan <serenapan _at_ nchc narl org tw>
#         Hsi-En Yu <yun _at_  nchc narl org tw>
#         Hui-Shan Chen  <chwhs _at_ nchc narl org tw>
#         Kuo-Yang Cheng  <kycheng _at_ nchc narl org tw>
#         CHI-MING Chen <jonchen _at_ nchc narl org tw>
#-------------------------------------------------------------------------------
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
