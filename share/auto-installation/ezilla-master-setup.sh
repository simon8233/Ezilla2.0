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
# The shell script modify Ezilla server config file
# 1. NFS service (Target:ezilla client can exchange ssh key with server.)
# 2. GET oneadmin UID,and GID.

source "$AUTO_INSTALL_WORKSPACE/ezilla-slave-variable"
source "$AUTO_INSTALL_WORKSPACE/ezilla-slave-config"

function SetupMasterNFSService(){
    
    cat /etc/exports  |grep "###oneadmin account public key" >> /dev/null
    if [ $? -ne 0 ]; then
        echo "###oneadmin account public key" >> /etc/exports
	    echo "/var/lib/one/.ssh 10.0.0.0/8(rw,no_root_squash)" >> /etc/exports
    	echo "###Export /var/lib/one/datastores" >> /etc/exports
    	echo "###Export /root/.ssh" >> /etc/exports
        echo "/root/.ssh 10.0.0.0/8(rw,no_root_squash)" >> /etc/exports
	    echo "" >> /etc/exports
        service nfs restart 
    fi

}
function SetupMasterHostFile(){

cat /etc/hosts |grep "ezilla-masterfs" >> /dev/null
if [ $? -ne 0 ];then
# have 2 net card , so using split on 2 cards
    if [ "$NETWORK" -eq "2"  ];then
        echo "192.168.10.254 ezilla-masterfs " >> /etc/hosts
        for ip in $(seq 1 100)
        do
            echo "192.168.10.$ip    ezilla-slavefs-$ip" >> /etc/hosts
        done   
# only 1 net card , so only using the card
    elif [ "$NETWORK" -eq "1" ];then
       sed -i "2a10.0.0.254 ezilla-masterfs " /etc/hosts 
   fi

    if [ ! -d $SLAVE_WEB_KICKSTART_DIR ];then
        mkdir -p $SLAVE_WEB_KICKSTART_DIR
    fi
        cp /etc/hosts $SLAVE_WEB_KICKSTART_DIR
fi

}
SetupMasterNFSService
SetupMasterHostFile
