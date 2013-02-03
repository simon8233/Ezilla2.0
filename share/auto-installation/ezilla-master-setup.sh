#!/bin/bash
# Author: Chang-Hsing Wu <hsing _at_ nchc narl org tw>
#         Serena Yi-Lun Pan <serenapan _at_ nchc narl org tw>
#         Jonathan CHI-Ming Chen <jonchen _at_ nchc narl org tw>
# License:GPL
# The shell script modify Ezilla server config file
# 1. NFS service (Target:ezilla client can exchange ssh key with server.)
# 2. GET oneadmin UID,and GID.

source "$AUTO_INSTALL_WORKSPACE/ezilla-slave-variable"

function SetupMasterNFSService(){
    
    cat /etc/exports  |grep "###oneadmin account public key" >> /dev/null
    if [ $? != 0 ]; then
        echo "###oneadmin account public key" >> /etc/exports
	    echo "/var/lib/one/.ssh 10.0.0.0/8(rw,no_root_squash)" >> /etc/exports
    	echo "###Export /var/lib/one/datastores" >> /etc/exports
    	echo "###Export /root/.ssh" >> /etc/exports
        echo "/root/.ssh 10.0.0.0/8(rw,no_root_squash)" >> /etc/exports
	    echo "" >> /etc/exports
        service nfs restart 
    fi

}
#function SetupMasterHostFile(){
    



#}
SetupMasterNFSService
